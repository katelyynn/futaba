import type { song } from "@/types/song.ts";

interface TransportEvents {
  play: () => void,
  pause: () => void,
  stop: () => void,
  ended: () => void,
  seek: (time: number) => void,
}

export class Transport {
  private ctx: AudioContext;

  private gain: GainNode;

  private source: AudioBufferSourceNode | null;

  private buffer: AudioBuffer | null;

  private started: number;
  private paused: number;
  private playing: boolean;

  private events: { [K in keyof TransportEvents]?: TransportEvents[K][] };

  constructor() {
    this.ctx = new AudioContext();
    this.gain = this.ctx.createGain();
    this.source = null;
    this.buffer = null;

    this.started = 0;
    this.paused = 0;
    this.playing = false;

    this.gain.connect(this.ctx.destination);

    this.events = {};
  }

  on<K extends keyof TransportEvents>(
    event: K,
    listener: TransportEvents[K]
  ) {
    this.events[event] ??= [];
    this.events[event]!.push(listener);
  }

  private emit<K extends keyof TransportEvents>(
    event: K,
    ...args: Parameters<TransportEvents[K]>
  ) {
    for (const listener of this.events[event] ?? []) {
      listener(...args);
    }
  }

  async decode(song: song): Promise<AudioBuffer> {
    const res = await fetch(song.url.href);
    if (!res.ok) {
      throw new Error(`failed to fetch song: ${res.status}`);
    }

    const bytes = await res.arrayBuffer();

    return await this.ctx.decodeAudioData(bytes);
  }

  play(buffer: AudioBuffer, offset = 0) {
    this.stop();

    this.ctx.resume();

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain);

    source.start(0, offset);

    this.buffer = buffer;
    this.source = source;

    this.started = this.ctx.currentTime - offset;
    this.playing = true;

    source.onended = () => {
      this.playing = false;
      this.source = null;

      this.emit("ended");
    }

    this.emit("play");
  }

  pause() {
    if (!this.source) return;

    this.paused = this.time();
    this.source.onended = null;
    this.source.stop();
    this.source = null;
    this.playing = false;

    this.emit("pause");
  }

  resume() {
    if (!this.buffer) return;
    this.play(this.buffer, this.paused);
  }

  time() {
    if (!this.playing) return this.paused;

    return this.ctx.currentTime - this.started;
  }

  seek(time: number) {
    if (!this.buffer) return;

    this.play(this.buffer, time);
  }

  stop() {
    if (this.source) {
      this.source.onended = null;
      this.source.stop();
      this.source = null;
    }

    this.playing = false;
    this.emit("stop");
  }
}
