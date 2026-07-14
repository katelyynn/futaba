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
  source: AudioBufferSourceNode | null,
  start?: number
}

export class Transport {
  private ctx: AudioContext;
  private gain: GainNode;

  private pausedQueue: QueuedBuffer[];
  private queue: QueuedBuffer[];

  private paused: number;
  private playing: boolean;

  // used for sending time updates lol
  private frame: number | null;
  private listeners: Map<string, Set<EventCallback>>;

  private userStopped: boolean;

  private anchor: number;
  private virtual: number;

  constructor() {
    this.ctx = new AudioContext();
    this.gain = this.ctx.createGain();

    this.pausedQueue = [];
    this.queue = [];

    this.paused = 0;
    this.playing = false;

    this.frame = null;
    this.listeners = new Map();
    this.userStopped = false;

    this.gain.connect(this.ctx.destination);

    this.anchor = 0;
    this.virtual = 0;
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

  schedule(song: song, buffer: AudioBuffer, override = false) {
    if (this.queue.length == 0 && !override) {
      setTimeout(() => this.schedule(song, buffer), 50);
      return;
    }

    this.scrap();

    console.warn("Audio: (schedule) before queue is now", this.queue.length, this.queue);

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain);

    const item: QueuedBuffer = { song, buffer, source };

    const currentSource = this.queue[0]?.source;
    if (currentSource) {
      const time = this.time();
      //if (time > this.queue[0].buffer.duration) time = 0;

      const remaining = this.queue[0].buffer.duration - time;
      const start = this.ctx.currentTime + remaining;

      console.warn("Audio: attempting scheduling, duration is", this.queue[0].buffer.duration, "time is", time, "start is", start, "current time is", this.ctx.currentTime);

      source.start(start, 0);
      item.start = start;
      console.warn("Audio: scheduled", song?.id, "at", start, "as there is", remaining, "remaining");
    } else {
      const start = this.ctx.currentTime;

      source.start(start, this.paused);
      item.start = start;
      console.warn("Audio: scheduled to play now");
    }

    this.queue.push(item);
    console.warn("Audio: (schedule) queue is now", this.queue.length, this.queue);

    this.logic(item);
  }

  private logic(item: QueuedBuffer) {
    item.source!.onended = () => {
      if (this.userStopped) return;

      this.anchor = this.ctx.currentTime;
      this.virtual = 0;
      this.paused = 0;

      if (this.queue[0] == item) {
        this.queue.shift();
      }

      if (this.queue.length > 0) {
        if (this.queue[0].song) {
          this.emit("next", this.queue[0].song);
          this.emit("duration", this.queue[0].buffer?.duration);
        }
      } else {
        this.playing = false;
        this.paused = 0;
        this.stopTimer();
        this.emit("ended");
      }
    }
  }

  private scrap() {
    const future = this.queue.splice(1);

    future.forEach(item => {
      if (item.source) {
        item.source.onended = null;
        try { item.source.stop(); } catch (e) { console.error("Audio: error scrapping", e); }
        item.source.disconnect();
      }
    });

    console.warn("Audio: scrapped, queue is now", this.queue.length, this.queue);
  }

  play(buffer: AudioBuffer, offset = 0) {
    this.ctx.resume();
    this.userStopped = false;
    this.playing = true;

    this.anchor = this.ctx.currentTime;
    this.virtual = 0;
    this.paused = offset;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain);

    const item: QueuedBuffer = { song: null!, buffer, source };
    this.queue.push(item);
    console.warn("Audio: (play) queue is now", this.queue.length, this.queue);

    source.start(0, offset);

    this.logic(item);

    this.startTimer();
    this.emit("duration", this.duration);
    this.emit("play");
    this.emit("time", offset);
  }

  pause() {
    if (!this.playing) return;
    this.paused = this.time();

    this.pausedQueue = [...this.queue];

    this.exit();
    this.playing = false;
    this.stopTimer();

    this.emit("pause");
    this.emit("time", this.paused);
  }

  resume() {
    if (this.pausedQueue.length == 0) return;

    const queue = [...this.pausedQueue];
    this.pausedQueue = [];
    this.queue = [];
    this.playing = true;
    this.userStopped = false;

    this.anchor = this.ctx.currentTime;
    this.virtual = 0;

    queue.forEach(item => {
      this.schedule(item.song, item.buffer, true);
    });

    this.startTimer();
    this.emit("play");
  }

  time() {
    if (!this.playing) return this.paused;

    const elapsed = this.ctx.currentTime - this.anchor;

    return (elapsed + this.paused) - this.virtual;
  }

  seek(time: number) {
    console.warn("Audio: seeking to", time, "with queue length", this.queue.length);
    if (this.queue.length == 0) return;

    const queue = [...this.queue];

    this.exit();

    this.userStopped = false;
    this.playing = true;

    this.anchor = this.ctx.currentTime;
    this.virtual = 0;
    this.paused = time;

    queue.forEach(item => {
      this.schedule(item.song, item.buffer, true);
    });

    this.startTimer();
    this.emit("time", time);
  }

  private exit() {
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
  }

  stop(emit = true) {
    this.exit();
    this.playing = false;
    this.stopTimer();

    this.anchor = 0;
    this.virtual = 0;
    this.paused = 0;

    if (emit) this.emit("stop");
  }
}
