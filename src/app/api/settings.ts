import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_VOLUME } from './player';

export const useSettings = create(persist(
  (set) => ({
    volume: DEFAULT_VOLUME,
    theme: "darker",
    scrobble: true,
    waveform: false,
    asideView: "queue",
    showAsideView: true,
    loop: false,
    shuffle: false,
    fullscreen: false,
    colourFromNowPlaying: false,

    setVolume: (volume: number) => set({ volume }),
    setTheme: (theme: "light" | "dark" | "darker" | "oled") => set({ theme }),
    setScrobble: (scrobble: boolean) => set({ scrobble }),
    setWaveform: (waveform: boolean) => set({ waveform }),
    setAsideView: (asideView: string) => set({ asideView }),
    setShowAsideView: (showAsideView: boolean) => set({ showAsideView }),
    setLoop: (loop: true | "once" | false) => set({ loop }),
    setShuffle: (shuffle: boolean) => set({ shuffle }),
    setFullscreen: (fullscreen: boolean) => set({ fullscreen }),
    setColourFromNowPlaying: (colourFromNowPlaying: boolean) => set({ colourFromNowPlaying })
  }),
  {
    name: "settings"
  }
));
