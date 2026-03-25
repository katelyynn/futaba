import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettings = create(persist(
  (set) => ({
    volume: 0.5,
    theme: "darker",
    scrobble: true,
    waveform: false,

    setVolume: (volume: number) => set({ volume }),
    setTheme: (theme: "light" | "dark" | "darker" | "oled") => set({ theme }),
    setScrobble: (scrobble: boolean) => set({ scrobble }),
    setWaveform: (waveform: boolean) => set({ waveform })
  }),
  {
    name: "settings"
  }
));