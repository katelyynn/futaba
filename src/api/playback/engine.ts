import { Transport } from "@/api/playback/transport.ts";
import type { EventCallback, TransportEventMap } from "@/api/playback/transport.ts";
import type { song } from "@/types/song.ts";

export class Engine {
  readonly transport: Transport;

  preloading: boolean;
  candidate: string;

  private listeners: Map<string, Set<EventCallback>>;

  constructor() {
    this.transport = new Transport();
    this.listeners = new Map();

    this.preloading = false;
    this.candidate = '';

    this.listen();
  }

  async preload(song: song) {
    if (!song || this.preloading) return;
    this.preloading = true;
    this.candidate = song.id;

    try {
      const buffer = await this.transport.decode(song);

      // ensure this is still the preload candidate
      if (song.id == this.candidate && this.preloading) {
        this.transport.schedule(song, buffer);
      } else {
        console.error("Audio: cancelled preload in the end");
      }
    } catch (e) {
      console.error("Audio: issue prevented preload", e);
    } finally {
      this.preloading = false;
      console.warn("Audio: preloaded");
    }
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
    forward("next");
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
    this.preloading = false;
    const buffer = await this.transport.decode(song);

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
    this.preloading = false;
  }
}
