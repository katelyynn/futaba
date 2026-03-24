import { song } from './song'

export interface album {
  id: string,
  name: string,
  artists: album_artist[],
  duration: number,
  songs: number,
  played: string,
  plays: number,
  types: string[],
  created: string,
  art: string,
  explicit: boolean
}

export interface album_full {
  id: string,
  name: string,
  artists: album_artist[],
  duration: number,
  songs: song[],
  played: string,
  plays: number,
  types: string[],
  created: string,
  art: string,
  explicit: boolean
}

interface album_artist {
  id: string,
  name: string
}