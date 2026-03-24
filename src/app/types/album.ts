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
  art: string
}

interface album_artist {
  id: string,
  name: string
}