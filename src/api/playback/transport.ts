import type { song } from "@/types/song.ts";

export class Transport {
  private ctx: AudioContext;

  private gain: GainNode;

  private source: AudioBufferSourceNode | null;

  private buffer: AudioBuffer | null;

  private started: number;
  private paused: number;
  private playing: boolean;

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
    }
  }

  pause() {
    if (!this.source) return;

    this.paused = this.time();
    this.source.stop();
    this.source = null;
    this.playing = false;
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
  }
}
