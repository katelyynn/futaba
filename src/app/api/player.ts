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
  let initialVolume = defaultVolume;
  let initialSong = null;
  let initialTime = 0;

  if (typeof window != 'undefined' && audio && !init) {
    init = true;

    audio.pause();
    audio.currentTime = 0;

    const savedVolume = localStorage.getItem("volume");
    initialVolume = savedVolume ? Math.min(1, Math.max(0, Number(savedVolume))) : defaultVolume;

    audio.volume = initialVolume;

    const savedPlayer = localStorage.getItem("player");

    if (savedPlayer) {
      try {
        const { song, time } = JSON.parse(savedPlayer);

        audio.src = song.url;
        audio.currentTime = time;

        initialSong = song;
        initialTime = time;
      } catch {
        localStorage.removeItem("player");
      }
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
    currentSong: initialSong,
    nowPlaying: false,
    currentTime: initialTime,
    duration: 0,
    volume: initialVolume,

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