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
  volume: number,

  play: (song: song, session: session, toScrobble: boolean, index?: number) => void,
  playNext: (session: session, toScrobble: boolean) => void,
  playPrev: (session: session, toScrobble: boolean) => void,
  addToQueue: (songs: song[], at?: number) => void,
  removeFromQueue: (index: number) => void,
  reorderQueue: (from: number, to: number) => void,
  clearQueue: () => void,
  pause: () => void,
  resume: () => void,
  seek: (time: number) => void,
  setToScrobble: (value: boolean) => void,
  setVolume: (value: number) => void,

  hydrate: (session: session) => void
}

let currentAudio: HTMLAudioElement | null = null;
let nextAudio: HTMLAudioElement | null = null;

export function getAudio() {
  if (typeof window == "undefined") return null;

  if (!currentAudio) {
    currentAudio = new Audio();
    nextAudio = new Audio();
  }

  return currentAudio;
}

let toScrobble = false;
let scrobbled = false;
let trackStartTime = 0;

function preloadNext() {
  const { queue, currentIndex } = usePlayer.getState();
  const next = queue[currentIndex + 1];

  if (!nextAudio || !next) return;

  nextAudio.src = next.url;
  nextAudio.preload = "auto";
}

export const usePlayer = create<playerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  currentSong: null,
  nowPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0,

  play: (song, session, toScrobble, index) => {
    const audio = getAudio();
    if (!audio) return;

    const { queue } = get();
    const newQueue = [...queue];

    let songIndex: number;

    if (index != null) {
      songIndex = index;
      song = newQueue[index];
    } else {
      songIndex = newQueue.findIndex(s => s.id == song.id);

      if (songIndex == -1) {
        newQueue.push(song);
        songIndex = newQueue.length - 1;
      }
    }

    set({ queue: newQueue });

    audio.pause();

    attachEvents(audio, session);

    audio.src = song.url;
    audio.currentTime = 0;
    audio.play().catch(() => {});

    set({ currentIndex: songIndex });
    preloadNext();

    if (toScrobble) sendNowPlaying(session, song.id);

    scrobbled = false;
    trackStartTime = Date.now();

    set({
      currentSong: song,
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

  clearQueue: () => {
    const audio = getAudio();
    if (!audio) return;

    audio.pause();
    audio.src = "";
    audio.currentTime = 0;

    set({
      queue: [],
      currentIndex: -1,
      currentSong: null
    });
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
  },

  setVolume: (value) => {
    if (currentAudio) currentAudio.volume = value;
    if (nextAudio) nextAudio.volume = value;

    set({
      volume: value
    });
  }
}));

function attachEvents(audio: HTMLAudioElement, session: session) {
  const { volume } = usePlayer.getState();

  audio.volume = volume;

  audio.ontimeupdate = () => {
    if (audio != currentAudio) return;

    const time = audio.currentTime;

    usePlayer.setState({currentTime: audio.currentTime});

    const { currentSong, nowPlaying } = usePlayer.getState();

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
    if (audio != currentAudio) return;

    usePlayer.setState({ duration: audio.duration });
  };

  audio.onplay = () => {
    if (audio != currentAudio) return;

    usePlayer.setState({ nowPlaying: true });
  }
  audio.onpause = () => {
    if (audio != currentAudio) return;

    usePlayer.setState({ nowPlaying: false });
  }

  audio.onended = () => {
    if (audio != currentAudio) return;

    const { queue, currentIndex, volume } = usePlayer.getState();
    const index = currentIndex + 1;
    const next = queue[index];

    if (!nextAudio || !next) {
      usePlayer.setState({ nowPlaying: false });
      return;
    }

    // swap
    const previousAudio = currentAudio;
    currentAudio = nextAudio;
    nextAudio = previousAudio;

    const newAudio = currentAudio;

    attachEvents(newAudio, session);

    newAudio.currentTime = 0;
    newAudio.play().catch(() => {});
    newAudio.volume = volume;

    usePlayer.setState({
      currentSong: next,
      currentIndex: index,
      currentTime: 0,
      duration: newAudio.duration || 0
    });

    preloadNext();
  };
}

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