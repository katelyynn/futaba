import { create } from 'zustand';
import { song } from '../types/song';
import { useSession } from '../session';
import { createAuth, session } from './client';

interface playerState {
  currentSong: song | null,
  nowPlaying: boolean,
  currentTime: number,
  duration: number,

  play: (song: song) => void,
  pause: () => void,
  resume: () => void,
  seek: (time: number) => void
}

const audio = typeof window != 'undefined' ? new Audio() : null;

export const usePlayer = create<playerState>((set, get) => {
  if (audio) {
    audio.ontimeupdate = () => {
      set({ currentTime: audio.currentTime });
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
      audio.play();

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