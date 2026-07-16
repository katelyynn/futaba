import type { song } from "@/types/song.ts";
import { note } from "@/api/log.ts";

export type TransportEventMap = {
  play: [],
  pause: [],
  stop: [],
  ended: [],
  time: [time: number],
  lastTime: [time: number],
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
    note(`Volume is now ${volume}`, 'engine');
  }

  get duration() {
    if (this.queue.length == 0) return 0;

    return this.queue[0].buffer.duration;
  }

  async decode(song: song): Promise<AudioBuffer> {
    note(`Decoding ${song.id}...`, 'engine');
    const res = await fetch(song.url.href);
    if (!res.ok) {
      throw new Error(`failed to fetch song: ${res.status}`);
    }

    const bytes = await res.arrayBuffer();

    note(`Decoded ${song.id}`, 'engine');
    return await this.ctx.decodeAudioData(bytes);
  }

  schedule(song: song, buffer: AudioBuffer, override = false) {
    if (this.queue.length == 0 && !override) {
      setTimeout(() => this.schedule(song, buffer), 50);
      return;
    }

    this.scrap();

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

      source.start(start, 0);
      item.start = start;
      note(`Scheduled ${song?.id} at ${start}, there are ${remaining} seconds remaining`, 'engine');
    } else {
      const start = this.ctx.currentTime;

      source.start(start, this.paused);
      item.start = start;
      note(`Scheduled ${song?.id} to play now`, 'engine');
    }

    this.queue.push(item);
    note(`Updated queue from schedule`, 'engine', [ this.queue ]);

    this.logic(item);
  }

  private logic(item: QueuedBuffer) {
    item.source!.onended = () => {
      if (this.userStopped) return;
      note(`Song ended, viewing situation`, 'engine');

      if (this.queue.length > 1) {
        this.queue.splice(0, 1);

        note(`Advancing to ${this.queue[0].song?.id} for next song`, 'engine');
        this.emit("next", this.queue[0].song);
        this.emit("lastTime", this.time());
        this.emit("duration", this.queue[0].buffer?.duration);
      } else {
        note(`Ended queue, nothing to go next`, 'engine');
        this.emit("lastTime", this.time());
        this.playing = false;
        this.stopTimer();
        this.emit("ended");
        this.userStopped = true;
      }

      this.anchor = this.ctx.currentTime;
      this.virtual = 0;
      this.paused = 0;
    }
  }

  scrap() {
    const future = this.queue.splice(1);

    future.forEach(item => {
      if (item.source) {
        item.source.onended = null;
        try { item.source.stop(); } catch (e) { console.error("Audio: error scrapping", e); }
        item.source.disconnect();
      }
    });

    note(`Cleaned queue`, 'engine', [ this.queue ]);
  }

  play(buffer: AudioBuffer, song: song, offset = 0) {
    this.ctx.resume();
    this.userStopped = false;
    this.playing = true;

    this.anchor = this.ctx.currentTime;
    this.virtual = 0;
    this.paused = offset;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain);

    const item: QueuedBuffer = { song, buffer, source };
    this.queue.push(item);

    source.start(0, offset);

    this.logic(item);

    this.startTimer();
    this.emit("duration", this.duration);
    this.emit("play");
    this.emit("time", offset);
    note(`Playing ${song?.id}`, 'engine');
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
    note(`Paused`, 'engine');
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
    note(`Resumed`, 'engine');
  }

  time() {
    if (!this.playing) return this.paused;

    const elapsed = this.ctx.currentTime - this.anchor;

    return (elapsed + this.paused) - this.virtual;
  }

  seek(time: number, id?: string) {
    const current = this.queue[0]?.song?.id;
    note(`Seeking to ${time}`, 'engine', [ this.queue ]);
    if (this.queue.length == 0 || !this.playing) return;

    // TODO: this current value is wrong, its not being updated fast enough
    // to have this check kick in.
    // im trying to stop seeking to the end of a song overwriting going next
    if (current && id && current != id) {
      note(`Denied seek due to id mismatch`, 'engine', [ { current, id } ]);
      return;
    }

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
