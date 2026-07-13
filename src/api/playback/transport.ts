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

export class Transport {
  private ctx: AudioContext;

  private gain: GainNode;

  private source: AudioBufferSourceNode | null;

  private buffer: AudioBuffer | null;

  private started: number;
  private paused: number;
  private playing: boolean;

  // used for sending time updates lol
  private frame: number | null;
  private listeners: Map<string, Set<EventCallback>>;

  private userStopped: boolean;

  constructor() {
    this.ctx = new AudioContext();
    this.gain = this.ctx.createGain();
    this.source = null;
    this.buffer = null;

    this.started = 0;
    this.paused = 0;
    this.playing = false;

    this.frame = null;
    this.listeners = new Map();
    this.userStopped = false;

    this.gain.connect(this.ctx.destination);
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
    if (!this.buffer) return 0;

    return this.buffer.duration;
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

  play(buffer: AudioBuffer, offset = 0) {
    this.stop(false);

    this.ctx.resume();

    console.log("Audio: attempting playback", offset, "/", this.duration);

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain);

    this.userStopped = false;

    source.start(0, offset);

    source.onended = () => {
      if (this.userStopped || this.time() < this.duration) return;

      this.playing = false;
      this.source = null;

      this.stopTimer();
      this.emit("ended");
    }

    this.buffer = buffer;
    this.source = source;

    this.started = this.ctx.currentTime - offset;
    this.playing = true;

    this.startTimer();
    this.emit("duration", this.duration);
    this.emit("play");
    this.emit("time", offset);

    console.log("Audio: playback has begun!", offset, "/", this.duration);
  }

  pause() {
    if (!this.source) return;
    console.log("Audio: pausing");

    this.paused = this.time();
    this.userStopped = true;
    this.source.stop();
    this.source = null;
    this.playing = false;

    this.stopTimer();
    this.emit("pause");
    this.emit("time", this.paused);
  }

  resume() {
    if (!this.buffer) return;
    console.log("Audio: resuming");
    this.play(this.buffer, this.paused);
  }

  time() {
    if (!this.playing) return this.paused;

    return this.ctx.currentTime - this.started;
  }

  seek(time: number) {
    if (!this.buffer) return;

    console.info("Audio: seeking to", time);
    this.userStopped = true;
    this.play(this.buffer, time);
  }

  stop(emit = true) {
    if (this.source) {
      this.userStopped = true;
      this.source.stop();
      this.source = null;
    }

    console.log("Audio: stopped, by user:", this.userStopped, "source is now", this.source, "emitting:", emit);

    this.playing = false;
    this.stopTimer();

    if (emit) this.emit("stop");
  }
}
