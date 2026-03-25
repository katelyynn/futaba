import { song } from './song'

export interface album {
  id: string,
  name: string,
  artists: album_artist[],
  duration: number,
  songs: number,
  played: string,
  plays: number,
  type: string,
  created: string,
  art: string,
  explicit: boolean,
  date: {
    year?: number,
    month?: number,
    day?: number
  }
}

export interface album_full {
  id: string,
  name: string,
  artists: album_artist[],
  duration: number,
  songs: song[],
  played: string,
  plays: number,
  type: string,
  created: string,
  art: string,
  explicit: boolean
}

interface album_artist {
  id: string,
  name: string
}