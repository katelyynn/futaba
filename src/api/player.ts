import { create } from 'zustand';
import type { song } from '@/types/song.ts';
import { createAuth } from './client.ts';
import type { session } from './client.ts';
import { sendNowPlaying, scrobble } from './scrobble.ts';
import { Player } from "@/api/playback/index.ts";
import { note } from "@/api/log.ts";

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

  play: (song: song, session: session, index?: number) => void,
  playNext: (session: session) => void,
  playPrev: (session: session) => void,
  addToQueue: (songs: song[], at?: number | null, preload?: boolean) => void,
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

let toScrobble = false;
let scrobbled = false;
let trackStartTime = 0;
let currentSession: session | null = null;

function preloadNext(next?: song) {
  note(`Received preload request, reviewing situation`, 'audio');
  if (!next) {
    const { queue, currentIndex, loop } = usePlayer.getState();
    let index = currentIndex + 1;

    if (loop == "once") {
      index = currentIndex;
      note(`Preloading ${index} as loop is 'once'`, 'audio', [ queue ]);
    } else if (index >= queue.length) {
      if (loop == true) {
        index = 0;
        note(`Preloading ${index} as loop is true`, 'audio', [ queue ]);
      } else {
        note(`Cancelling preload as loop is off`, 'audio', [ queue ]);
        return;
      }
    }

    next = queue[index];
  }

  if (next) {
    note(`Preloading ${next?.id} as next song`, 'audio');
    Player.preload(next);
  }
}

function setupEvents() {
  Player.on("time", (time: number) => {
    usePlayer.setState({ currentTime: time });

    if (!currentSession) return;

    const { currentSong, nowPlaying, duration } = usePlayer.getState();

    if (currentSong) {
      //localStorage.setItem("player", JSON.stringify({ song: currentSong, time, queue, currentIndex }));

      if (nowPlaying && toScrobble && !scrobbled) {
        const validScrobble = time > 240 || (duration && time > duration * 0.5);

        if (validScrobble) {
          scrobbled = true;
          scrobble(currentSession, currentSong.id, trackStartTime);
        }
      }
    }
  });

  Player.on("duration", (duration: number) => {
    note(`Saved new duration as ${duration}`, 'audio');
    usePlayer.setState({ duration });
  });

  Player.on("play", () => {
    usePlayer.setState({ nowPlaying: true });
  });

  Player.on("pause", () => {
    usePlayer.setState({ nowPlaying: false });
  });

  Player.on("stop", () => {
    usePlayer.setState({ nowPlaying: false });
  });

  Player.on("ended", () => {
    usePlayer.setState({ nowPlaying: false });
  });

  Player.on("next", (song: song) => {
    if (!currentSession) return;
    console.warn("Audio: fired 'next' event");

    const { currentIndex, queue, loop } = usePlayer.getState();

    let index = currentIndex + 1;

    if (loop == "once") {
      index = currentIndex;
      note(`Changed index to ${index}`, 'audio');
    } else if (loop == true && index >= queue.length) {
      index = 0;
      note(`Changed index to ${index}`, 'audio');
    } else if (index >= queue.length) {
      note(`Returning as queue is finished`, 'audio');
      return;
    }

    note(`Continuing, queue is not finished`, 'audio');

    // loop full is enabled, but album is still going

    if (toScrobble) sendNowPlaying(currentSession, song.id);

    usePlayer.setState({
      currentSong: song,
      currentIndex: index,
      nowPlaying: true
    });

    scrobbled = false;
    trackStartTime = Date.now();

    preloadNext();
  });
};

setupEvents();

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

  play: (song, session, index) => {
    currentSession = session;

    const { queue, volume } = get();
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

    Player.setVolume(volume);
    Player.play(song);

    if (toScrobble) sendNowPlaying(session, song.id);

    scrobbled = false;
    trackStartTime = Date.now();

    set({
      currentSong: song,
      currentIndex: songIndex,
      queue: newQueue,
      currentTime: 0,
      nowPlaying: true
    });

    note(`Requesting playback for ${song.id}`, 'audio');
    preloadNext();
  },

  playNext: (session) => {
    const { currentIndex, queue } = get();
    if (currentIndex >= queue.length - 1) return;

    const index = currentIndex + 1;

    Player.stop();

    get().play(queue[index], session, index);
  },

  playPrev: (session) => {
    const { currentIndex, queue } = get();
    if (currentIndex <= 0) return;

    const index = currentIndex - 1;

    Player.stop();

    get().play(queue[index], session, index);
  },

  addToQueue: (songs, at, preload = true) => {
    set(state => {
      const { currentIndex } = get();
      const next = state.queue[currentIndex + 1]?.id;
      const newQueue = [...state.queue];

      if (at != null) {
        newQueue.splice(at, 0, ...songs);
      } else {
        newQueue.push(...songs);
      }

      if (newQueue[currentIndex + 1]?.id != next && preload) {
        note(`Sending preload as queue has updated (${next} -> ${newQueue[currentIndex + 1]?.id})`, 'audio');
        preloadNext(newQueue[currentIndex + 1]);
      }

      return { queue: newQueue };
    })
  },

  removeFromQueue: (index) => {
    set(state => {
      const { currentIndex, nowPlaying } = get();
      const next = state.queue[currentIndex + 1]?.id;

      const newQueue = [...state.queue];
      newQueue.splice(index, 1);

      let newIndex = state.currentIndex;
      if (index < state.currentIndex) {
        newIndex--;
      } else if (index == state.currentIndex) {
        Player.pause();
        newIndex = -1;
      }

      if (nowPlaying && newQueue[newIndex + 1]?.id != next) {
        if (newQueue[newIndex + 1]?.id) {
          note(`Sending preload as queue has updated (${next} -> ${newQueue[newIndex + 1]?.id})`, 'audio');
          preloadNext(newQueue[newIndex + 1]);
        } else {
          Player.scrap();
        }
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

      preloadNext(newQueue[newIndex + 1]);

      return {
        queue: newQueue,
        currentIndex: newIndex
      };
    })
  },

  clearQueue: () => {
    Player.stop();

    set({
      queue: [],
      currentIndex: -1,
      currentSong: null,
      nowPlaying: false
    });
  },

  pause: () => {
    Player.pause();

    set({
      nowPlaying: false
    });
  },

  resume: () => {
    Player.resume();

    set({
      nowPlaying: true
    });
  },

  seek: (time) => {
    const { currentSong, currentTime } = get();

    if (time != currentTime) {
      Player.seek(time, currentSong?.id);
    }
  },

  setToScrobble: (value) => {
    toScrobble = value;
  },

  hydrate: () => {
    set({
      nowPlaying: false
    });
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
    Player.setVolume(value);

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
