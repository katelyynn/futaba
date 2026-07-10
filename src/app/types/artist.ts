import { album } from "./album"

export interface ArtistListV2 {
  id: string,
  art: string,
  name: string,
  songs: number,
  albums: number,
  starred?: string,
  played?: string,
  plays?: number,
  created: string
}

export interface artist {
  id: string,
  art: string,
  name: string,
  albums: number,
  songs: number,
  starred?: string,
  created: string
}

export interface artistFull {
  id: string,
  art: string,
  name: string,
  albums: Record<string, album[]>,
  albumCount: number
}
