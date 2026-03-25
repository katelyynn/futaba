import { create } from 'zustand';
import { song } from '../types/song';
import { useSession } from '../session';
import { createAuth, session } from './client';

interface playerState {
  currentSong: song | null,
  nowPlaying: boolean,
  currentTime: number,
  duration: number,
  volume: number,

  play: (song: song) => void,
  pause: () => void,
  resume: () => void,
  seek: (time: number) => void,

  setVolume: (volume: number) => void
}

const audio = typeof window != 'undefined' ? new Audio() : null;
const defaultVolume = 0.5;

let init = false;

export const usePlayer = create<playerState>((set, get) => {
  if (audio && !init) {
    init = true;

    audio.pause();
    audio.currentTime = 0;

    const saved = localStorage.getItem("volume");
    const initVolume = saved ? Math.min(1, Math.max(0, Number(saved))) : defaultVolume;

    audio.volume = initVolume;

    set({ volume: initVolume });

    const savedPlayer = localStorage.getItem("player");

    if (savedPlayer) {
      const { song, time } = JSON.parse(savedPlayer);

      audio.src = song.url;
      audio.currentTime = time;

      set({ currentSong: song, currentTime: time });
    }

    audio.ontimeupdate = () => {
      const time = audio.currentTime;

      set({ currentTime: audio.currentTime });

      const currentSong = get().currentSong;
      if (currentSong) {
        localStorage.setItem("player", JSON.stringify({ song: currentSong, time }));
      }
    };

    audio.onloadedmetadata = () => {
      set({ duration: audio.duration });
    };

    audio.onplay = () => set({ nowPlaying: true });
    audio.onpause = () => set({ nowPlaying: false });

    audio.onended = () => {
      set({ nowPlaying: false });
    };
  }

  return {
    currentSong: null,
    nowPlaying: false,
    currentTime: 0,
    duration: 0,

    play: (song) => {
      if (!audio) return;

      audio.src = song.url;
      audio.currentTime = 0;
      audio.play().catch(e => {
        if (e.name != "AbortError") console.error(e);
      });

      set({
        currentSong: song,
        currentTime: 0
      });
    },

    pause: () => {
      audio?.pause();
    },

    resume: () => {
      audio?.play();
    },

    seek: (time) => {
      if (!audio) return;

      audio.currentTime = time;
      set({ currentTime: time });
    },

    volume: defaultVolume,

    setVolume: (volume) => {
      if (!audio) return;

      audio.volume = volume;
      localStorage.setItem("volume", volume.toString());

      set({ volume });
    }
  }
});

export function createStreamURL(id: string, session: session) {
  const auth = createAuth(session);

  const url = new URL(`/rest/stream.view`, auth.baseURL);

  const params = {
    id
  };

  url.search = new URLSearchParams({
    ...auth.params,
    ...params
  });

  return url;
}