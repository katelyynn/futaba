import { Transport } from "@/api/playback/transport.ts";
import type { song } from "@/types/song.ts";

export class Engine {
  readonly transport: Transport;

  queue: song[];

  index: number;

  current: { song: song, buffer: AudioBuffer } | null;

  shuffle: boolean;

  loop: true | "once" | false;

  constructor() {
    this.transport = new Transport();
    this.queue = [];
    this.index = -1;
    this.current = null;
    this.shuffle = false;
    this.loop = false;
  }

  get volume() {
    return this.transport.volume;
  }

  setVolume(volume: number) {
    this.transport.setVolume(volume);
  }

  async play(song: song) {
    const buffer = await this.transport.decode(song);

    this.current = {
      song,
      buffer
    }

    this.transport.play(buffer);
  }

  pause() {
    this.transport.pause();
  }

  resume() {
    this.transport.resume();
  }

  seek(time: number) {
    this.transport.seek(time);
  }

  stop() {
    this.transport.stop();

    this.current = null;
  }
}
