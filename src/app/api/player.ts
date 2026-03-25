import { create } from 'zustand';
import { song } from '../types/song';
import { useSession } from '../session';
import { createAuth, session } from './client';
import { sendNowPlaying, scrobble } from './scrobble';

interface playerState {
  queue: song[],
  currentIndex: number,
  currentSong: song | null,
  nowPlaying: boolean,
  currentTime: number,
  duration: number,

  play: (song: song, session: session, toScrobble: boolean, index?: number) => void,
  playNext: (session: session, toScrobble: boolean) => void,
  playPrev: (session: session, toScrobble: boolean) => void,
  addToQueue: (songs: song[], at?: number) => void,
  removeFromQueue: (index: number) => void,
  reorderQueue: (from: number, to: number) => void,
  pause: () => void,
  resume: () => void,
  seek: (time: number) => void,
  setToScrobble: (value: boolean) => void,

  hydrate: (session: session) => void
}

let globalAudio: HTMLAudioElement | null = null;

export function getAudio() {
  if (typeof window == "undefined") return null;

  if (!globalAudio) {
    globalAudio = new Audio();
  }

  return globalAudio;
}

let toScrobble = false;
let scrobbled = false;
let trackStartTime = 0;

export const usePlayer = create<playerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  currentSong: null,
  nowPlaying: false,
  currentTime: 0,
  duration: 0,

  play: (song, session, toScrobble, index) => {
    const audio = getAudio();
    if (!audio) return;

    const { queue } = get();
    const songToPlay: song | null = song ?? queue[get().currentIndex];
    const newIndex: number = index ?? (song ? queue.findIndex(s => s.id == song.id) : get().currentIndex);

    if (!songToPlay || newIndex < 0) return;

    audio.src = song.url;
    audio.currentTime = 0;
    audio.play().catch(() => {});

    if (toScrobble) sendNowPlaying(session, song.id);

    scrobbled = false;
    trackStartTime = Date.now();

    set({
      currentSong: songToPlay,
      currentIndex: newIndex,
      currentTime: 0
    });
  },

  playNext: (session, toScrobble) => {
    const { currentIndex, queue } = get();
    if (currentIndex >= queue.length - 1) return;

    const index = currentIndex + 1;

    get().play(queue[index], session, toScrobble, index);
  },

  playPrev: (session, toScrobble) => {
    const { currentIndex, queue } = get();
    if (currentIndex <= 0) return;

    const index = currentIndex - 1;

    get().play(queue[index], session, toScrobble, index);
  },

  addToQueue: (songs, at) => {
    set(state => {
      const newQueue = [...state.queue];

      if (at) {
        newQueue.splice(at, 0, ...songs);
      } else {
        newQueue.push(...songs);
      }

      return { queue: newQueue };
    })
  },

  removeFromQueue: (index) => {
    const audio = getAudio();
    if (!audio) return;

    set(state => {
      const newQueue = [...state.queue];
      newQueue.splice(index, 1);

      let newIndex = state.currentIndex;
      if (index < state.currentIndex) {
        newIndex--;
      } else if (index == state.currentIndex) {
        audio.pause();
        newIndex = -1;
      }

      return {
        queue: newQueue,
        currentIndex: newIndex,
        currentSong: newQueue[newIndex] ?? null
      };
    })
  },

  reorderQueue: (from, to) => {
    set(state => {
      const newQueue = [...state.queue];
      const [ moved ] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, moved);

      let newIndex = state.currentIndex;
      if (from == state.currentIndex) {
        newIndex = to;
      } else if (from < state.currentIndex && to >= state.currentIndex) {
        newIndex--;
      } else if (from > state.currentIndex && to <= state.currentIndex) {
        newIndex++;
      }

      return {
        queue: newQueue,
        currentIndex: newIndex
      };
    })
  },

  pause: () => {
    const audio = getAudio();
    if (!audio) return;

    audio?.pause();
  },

  resume: () => {
    const audio = getAudio();
    if (!audio) return;

    audio?.play().catch(() => {});
  },

  seek: (time) => {
    const audio = getAudio();
    if (!audio) return;

    audio.currentTime = time;
    set({ currentTime: time });
  },

  setToScrobble: (value) => {
    toScrobble = value;
  },

  hydrate: (session) => {
    const audio = getAudio();
    if (!audio) return;

    const savedPlayer = localStorage.getItem("player");

    if (savedPlayer) {
      try {
        const { song, time } = JSON.parse(savedPlayer);

        audio.src = song.url;
        audio.currentTime = time;

        set({
          currentSong: song,
          currentTime: time
        });
      } catch {
        localStorage.removeItem("player");
      }
    }

    audio.ontimeupdate = () => {
      const time = audio.currentTime;

      set({ currentTime: audio.currentTime });

      const { currentSong, nowPlaying } = get();

      if (currentSong) {
        localStorage.setItem("player", JSON.stringify({ song: currentSong, time }));

        if (nowPlaying && toScrobble && !scrobbled) {
          const validScrobble = audio.currentTime > 240 || (currentSong.duration && audio.currentTime > currentSong.duration * 0.5);

          if (validScrobble) {
            scrobbled = true;
            scrobble(session, currentSong.id, trackStartTime);
          }
        }
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
}));

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