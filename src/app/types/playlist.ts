import { song } from './song'

export interface playlist {
  id: string,
  name: string,
  comment?: string,
  duration: number,
  songs: number,
  created: string,
  art: string,
  changed: string
}

export interface playlistFull {
  id: string,
  name: string,
  comment?: string,
  duration: number,
  songCount: number,
  created: string,
  art: string,
  changed: string,
  songs: song[]
}