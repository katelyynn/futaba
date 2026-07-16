export interface song {
  art?: string,
  id: string,
  name: string,
  artists: song_artist[],
  duration: number,
  played?: string,
  plays?: number,
  created: string,
  comment?: string,
  contentType?: string,
  bitDepth: number,
  bitRate: number,
  bpm?: number,
  channelCount: number,
  explicit: boolean,
  genres: string[],
  index: number,
  suffix: string,
  path: string,
  url: URL,
  album?: string,
  albumId: string,
  starred?: string
}

interface song_artist {
  id: string,
  name: string
}
