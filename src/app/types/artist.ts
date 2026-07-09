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
  roles: string[],
  starred?: string
}
