import { create } from 'zustand';
import type { song } from '@/types/song.ts';
import { createAuth } from './client.ts';
import type { session } from './client.ts';
import { sendNowPlaying, scrobble } from './scrobble.ts';

export const DEFAULT_VOLUME = 0.3;
export const MAX_VOLUME = 0.6;

interface playerState {
  queue: song[],
  currentIndex: number,
  currentSong: song | null,
  nowPlaying: boolean,
  currentTime: number,
  duration: number,
  volume: number,
  loop: true | "once" | false,
  shuffle: boolean,
  loved: Record<string, boolean>,

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
  setLoop: (value: true | "once" | false) => void,
  setShuffle: (value: boolean) => void,
  setLoved: (id: string, value: boolean) => void,

  hydrate: (session: session) => void
}

const audio = new Audio();
audio.crossOrigin = "anonymous";
const ctx = new AudioContext();
const bind = ctx.createMediaElementSource(audio);

const gain = ctx.createGain();

bind
  .connect(gain)
  .connect(ctx.destination);

let toScrobble = false;
let scrobbled = false;
let trackStartTime = 0;

function preloadNext(next?: song) {
  if (!next) {
    const { queue, currentIndex } = usePlayer.getState();
    next = queue[currentIndex + 1];
  }
}

export const usePlayer = create<playerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  currentSong: null,
  nowPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0,
  loop: false,
  shuffle: false,
  loved: {},

  play: (song, session, toScrobble, index) => {
    if (ctx.state != "running") {
      ctx.resume();
    }

    console.info("audio information", {
      audio,
      ctx,
      bind,
      gain
    });

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

    audio.src = song.url.href;
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
      const { currentIndex } = get();
      const newQueue = [...state.queue];

      if (at != null) {
        newQueue.splice(at, 0, ...songs);
      } else {
        newQueue.push(...songs);
      }

      preloadNext(newQueue[currentIndex + 1]);

      return { queue: newQueue };
    })
  },

  removeFromQueue: (index) => {
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

      preloadNext(newQueue[newIndex + 1]);

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

      preloadNext(newQueue[newIndex + 1]);

      return {
        queue: newQueue,
        currentIndex: newIndex
      };
    })
  },

  clearQueue: () => {
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
    audio?.pause();
  },

  resume: () => {
    audio?.play().catch(() => {});

    if (ctx.state != "running") {
      ctx.resume();
    }
  },

  seek: (time) => {
    audio.currentTime = time;
    set({ currentTime: time });
  },

  setToScrobble: (value) => {
    toScrobble = value;
  },

  hydrate: () => {
    const savedPlayer = localStorage.getItem("player");

    if (savedPlayer) {
      try {
        const { song, time, queue, currentIndex } = JSON.parse(savedPlayer);

        audio.src = song.url;
        audio.currentTime = time;

        set({
          currentSong: song,
          duration: audio.duration || 0,
          currentTime: time,
          queue: queue || [],
          currentIndex: currentIndex || -1
        });
      } catch {
        localStorage.removeItem("player");
      }
    }
  },

  setLoved: (id, value) => {
    set(state => ({
      loved: {
        ...state.loved,
        [id]: value
      }
    }))
  },

  setVolume: (value) => {
    gain.gain.value = value;

    set({
      volume: value
    });
  },

  setLoop: (value) => {
    set({
      loop: value
    });
  },

  setShuffle: (value) => {
    set({
      shuffle: value
    });
  }
}));

function attachEvents(audio: HTMLAudioElement, session: session) {
  audio.ontimeupdate = () => {
    const time = audio.currentTime;

    usePlayer.setState({currentTime: audio.currentTime});

    const { currentSong, nowPlaying, queue, currentIndex } = usePlayer.getState();

    if (currentSong) {
      localStorage.setItem("player", JSON.stringify({ song: currentSong, time, queue, currentIndex }));

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
    usePlayer.setState({ duration: audio.duration });
  };

  audio.onplay = () => {
    usePlayer.setState({ nowPlaying: true });
  }
  audio.onpause = () => {
    usePlayer.setState({ nowPlaying: false });
  }

  audio.onended = async () => {
    console.time("song ended");
    const { queue, currentSong, currentIndex, loop } = usePlayer.getState();
    let index;

    console.log("queue length", queue.length, "loop is", loop, loop == true, loop === true);

    if ((queue.length == 1 && loop) || loop == "once") {
      console.log("length is 1 and loop enabled");
      index = currentIndex;
    } else if (queue.length > 1 && loop === true) {
      console.log("length over 1 and loop is true");
      index = currentIndex + 1;

      if (index > queue.length - 1) {
        index = 0;
      } else {
        //swapAudio = true;
      }
    } else if (queue.length > 1) {
      console.log("length over 1");
      index = currentIndex + 1;
      //swapAudio = true;
    } else {
      usePlayer.setState({ nowPlaying: false });
      return;
    }

    const next = queue[index];

    if (!audio || !next) {
      usePlayer.setState({ nowPlaying: false });
      return;
    }

    if (toScrobble) sendNowPlaying(session, next.id);

    scrobbled = false;
    trackStartTime = Date.now();

    if (currentSong != next) audio.src = next.url.href;
    console.timeLog("song ended", "set src");
    audio.currentTime = 0;
    await audio.play().catch(() => {});

    usePlayer.setState({
      currentSong: next,
      currentIndex: index,
      currentTime: 0,
      duration: audio.duration || 0
    });
    console.timeEnd("song ended");
  };
}

export function createStreamURL(id: string, session: session) {
  const auth = createAuth(session);

  const url = new URL(`/rest/stream.view`, auth.baseURL);

  const params = {
    id
  };

  /* @ts-expect-error guhh */
  url.search = new URLSearchParams({
    ...auth.params,
    ...params
  });

  return url;
}
