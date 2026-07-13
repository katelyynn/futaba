import type { song } from "@/types/song.ts";

export type TransportEventMap = {
  play: [],
  pause: [],
  stop: [],
  ended: [],
  time: [time: number],
  duration: [duration: number],
  next: [song: song]
}

export type EventCallback<T extends any[] = any[]> = (...args: T) => void;

interface QueuedBuffer {
  song: song,
  buffer: AudioBuffer,
  source: AudioBufferSourceNode | null
}

export class Transport {
  private ctx: AudioContext;
  private gain: GainNode;

  private queue: QueuedBuffer[];
  private queueTime: number;
  private queueDuration: number;

  private offset: number;

  private paused: number;
  private playing: boolean;

  // used for sending time updates lol
  private frame: number | null;
  private listeners: Map<string, Set<EventCallback>>;

  private userStopped: boolean;

  constructor() {
    this.ctx = new AudioContext();
    this.gain = this.ctx.createGain();

    this.queue = [];
    this.queueTime = 0;
    this.queueDuration = 0;

    this.paused = 0;
    this.playing = false;

    this.frame = null;
    this.listeners = new Map();
    this.userStopped = false;

    this.gain.connect(this.ctx.destination);

    this.offset = 0;
  }

  on<K extends keyof TransportEventMap>(
    event: K,
    callback: (...args: TransportEventMap[K]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback as EventCallback);

    return () => this.off(event, callback);
  }

  off<K extends keyof TransportEventMap>(
    event: K,
    callback: (...args: TransportEventMap[K]) => void
  ): void {
    this.listeners.get(event)?.delete(callback as EventCallback);
  }

  private emit<K extends keyof TransportEventMap>(
    event: K,
    ...args: TransportEventMap[K]
  ): void {
    this.listeners.get(event)?.forEach((callback) => callback(...args));
  }

  private startTimer() {
    if (this.frame) return;

    let lastUpdate = 0;
    const interval = 250; // 0.25s

    const tick = () => {
      if (!this.playing) {
        // timing info sent manually
        this.frame = null;
        return;
      }

      const now = performance.now();
      if (now - lastUpdate >= interval) {
        this.emit("time", this.time());
        lastUpdate = now;
      }

      this.frame = requestAnimationFrame(tick);
    }

    this.frame = requestAnimationFrame(tick);
  }

  private stopTimer() {
    if (!this.frame) return;

    cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  get volume() {
    return this.gain.gain.value;
  }

  setVolume(volume: number) {
    this.gain.gain.value = volume;
    console.log("Audio: set volume to", volume);
  }

  get duration() {
    if (this.queue.length == 0) return 0;

    return this.queue[0].buffer.duration;
  }

  async decode(song: song): Promise<AudioBuffer> {
    console.log("Audio: decoding", song.id);
    const res = await fetch(song.url.href);
    if (!res.ok) {
      throw new Error(`failed to fetch song: ${res.status}`);
    }

    const bytes = await res.arrayBuffer();

    console.log("Audio: finished decoding", song.id);
    return await this.ctx.decodeAudioData(bytes);
  }

  schedule(song: song, buffer: AudioBuffer) {
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain);

    const item: QueuedBuffer = { song, buffer, source };
    this.queue.push(item);

    if (this.queue.length == 1) {
      this.queueTime = this.ctx.currentTime;
      source.start(0, this.paused);
    } else {
      const previous = this.queueTime + this.queueDuration;
      source.start(previous, 0);
    }

    this.queueDuration += buffer.duration;
    this.logic(item);
  }

  private logic(item: QueuedBuffer) {
    item.source!.onended = () => {
      if (this.userStopped) return;

      if (this.queue[0] == item) {
        const finished = this.queue[0].buffer.duration;

        this.queue.shift();
        this.queueTime += finished;
        this.queueDuration -= finished;
        this.offset += finished;
      }

      if (this.queue.length > 0) {
        if (this.queue[0].song) {
          this.emit("next", this.queue[0].song);
        }
      } else {
        this.playing = false;
        this.paused = 0;
        this.stopTimer();
        this.emit("ended");
      }
    }
  }

  play(buffer: AudioBuffer, offset = 0) {
    this.exit();

    this.ctx.resume();
    this.userStopped = false;
    this.playing = true;
    this.paused = offset;
    this.offset = 0;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain);

    const item: QueuedBuffer = { song: null!, buffer, source };
    this.queue.push(item);

    this.queueTime = this.ctx.currentTime;
    source.start(0, offset);

    this.queueDuration += buffer.duration;
    this.logic(item);

    this.startTimer();
    this.emit("duration", this.duration);
    this.emit("play");
    this.emit("time", offset);
  }

  pause() {
    if (!this.playing) return;
    this.paused = this.time();

    this.exit();
    this.playing = false;
    this.stopTimer();

    this.emit("pause");
    this.emit("time", this.paused);
  }

  resume() {
    if (this.queue.length == 0) return;

    const queue = [...this.queue];
    this.queue = [];
    this.queueDuration = 0;
    this.playing = true;
    this.userStopped = false;

    queue.forEach(item => {
      this.schedule(item.song, item.buffer)
    });

    this.startTimer();
    this.emit("play");
  }

  time() {
    if (!this.playing) return this.paused;

    const raw = (this.ctx.currentTime - this.queueTime) + this.paused;

    return raw - this.offset;
  }

  seek(time: number) {
    if (this.queue.length == 0) return;

    if (this.queue[0].source) {
      this.queue[0].source.onended = null;
      try { this.queue[0].source.stop(); } catch {}
      this.queue[0].source.disconnect();
    }

    const queue = [...this.queue];
    this.queue = [];
    this.queueDuration = 0;
    this.userStopped = false;
    this.playing = true;

    this.paused = time;

    queue.forEach(item => {
      this.schedule(item.song, item.buffer);
    });

    this.startTimer();
    this.emit("time", time);
  }

  private exit() {
    this.userStopped = true;
    this.queue.forEach(item => {
      if (item.source) {
        item.source.onended = null;
        try {
          item.source.stop();
        } catch {}
        item.source.disconnect();
      }
    });

    this.queue = [];
    this.queueDuration = 0;
  }

  stop(emit = true) {
    this.exit();
    this.playing = false;
    this.paused = 0;
    this.stopTimer();

    if (emit) this.emit("stop");
  }
}
