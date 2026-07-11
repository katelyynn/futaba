import type { song } from './song.ts'

export interface album {
  id: string,
  artistId?: string,
  name: string,
  artists: album_artist[],
  duration: number,
  songs: number,
  played?: string,
  plays?: number,
  type: string,
  created: string,
  art: string,
  explicit: boolean,
  date?: string,
  year?: number,
  starred?: string,
  imported?: string
}

export interface album_full {
  id: string,
  name: string,
  artists: album_artist[],
  duration: number,
  songs: Record<string, song[]>,
  songsList: song[],
  songCount: number,
  played?: string,
  plays?: number,
  type: string,
  created: string,
  art: string,
  explicit: boolean,
  starred?: string,
  genres: string[],
  discTitles: string[],
  year: number
}

interface album_artist {
  id: string,
  name: string
}
