import { Transport } from "@/api/playback/transport.ts";
import type { EventCallback, TransportEventMap } from "@/api/playback/transport.ts";
import type { song } from "@/types/song.ts";

export class Engine {
  readonly transport: Transport;

  queue: song[];

  index: number;

  current: { song: song, buffer: AudioBuffer } | null;

  shuffle: boolean;

  loop: true | "once" | false;

  private listeners: Map<string, Set<EventCallback>>;

  constructor() {
    this.transport = new Transport();
    this.queue = [];
    this.index = -1;
    this.current = null;
    this.shuffle = false;
    this.loop = false;
    this.listeners = new Map();

    this.listen();
  }

  private listen() {
    const forward = <K extends keyof TransportEventMap>(event: K) => {
      this.transport.on(event, ((...args: TransportEventMap[K]) => {
        this.emit(event, ...args);
      }) as EventCallback);
    };

    forward("play");
    forward("pause");
    forward("duration");
    forward("time");
    forward("stop");
    forward("ended");
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

  get volume() {
    return this.transport.volume;
  }

  setVolume(volume: number) {
    this.transport.setVolume(volume);
  }

  get duration() {
    return this.transport.duration;
  }

  get time() {
    return this.transport.time;
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
