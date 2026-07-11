import type { album, album_full } from '@/types/album.ts';
import type { song } from '@/types/song.ts';
import { request, requestV2 } from './client.ts';
import type { session } from './client.ts';
import { getCoverArt } from './cover.ts';
import { createStreamURL } from './player.ts';

export async function getAlbumsV2(session: session, start = 0, end = 20, order = 'DESC', sort = 'recently_added') {
  const res = await requestV2(session, 'api/album', {
    _start: start,
    _end: end,
    _order: order,
    _sort: sort
  });

  const albums: album[] = [];
  /* @ts-expect-error guhh */
  res.data.forEach(album => {
    const artists = album.participants.albumartist || [];
    const art = getCoverArt(session, album.id);

    if (sort == 'play_date' && !album.playDate) return;
    if (sort == 'play_count' && !album.playCount) return;

    albums.push({
      id: album.id,
      name: album.name,
      artists,
      duration: album.duration,
      songs: album.songCount,
      played: album.playDate,
      plays: album.playCount,
      type: album.mbzAlbumType || 'album',
      created: album.createdAt,
      art,
      explicit: album.explicitStatus != '',
      date: album.date,
      year: album.maxYear,
      starred: album.starred,
      imported: album.importedAt
    });
  });

  return albums;
}

export async function getAlbums(session: session, size = 100): Promise<album[]> {
  console.log('getAlbums');
  const res = await request(session, "getAlbumList", { type: "recent", size });

  console.info('res', res);

  const albums: album[] = [];
  /* @ts-expect-error guhh */
  res.albumList.album.forEach(album => {
    const art = getCoverArt(session, album.id);

    albums.push({
      id: album.id,
      name: album.name,
      artists: album.artists,
      duration: album.duration,
      songs: album.songCount,
      played: album.played,
      plays: album.plays,
      created: album.created,
      art: art,
      year: album.year,
      explicit: album.explicitStatus != '',
      starred: album.starred,
      type: ''
    });
  });

  return albums;
}

export interface AlbumV2 {
  id: string,
  artistId?: string,
  name: string,
  date: string,
  artists: { id: string, name: string, missing: boolean }[],
  type: string,
  songs: number,
  played?: string,
  plays?: number,
  created: string,
  art: string,
  genres: { id: string, name: string }[],
  comment?: string,
  duration: number,
  starred?: boolean,
  explicit: boolean,
  label: string[],
  size: number,
  imported: string
}

export async function getAlbumV2(session: session, id: string): Promise<AlbumV2> {
  const res = await requestV2(session, `api/album/${id}`);

  const data = res.data;
  const artists = data.participants.albumartist || [];

  const art = getCoverArt(session, data.id);

  return {
    id: data.id,
    artistId: data.albumArtistId,
    name: data.name,
    date: data.date,
    artists,
    type: data.mbzAlbumType || 'album',
    songs: data.songCount,
    played: data.playDate,
    plays: data.playCount,
    created: data.createdAt,
    art,
    genres: data.genres || [],
    comment: data.comment,
    duration: data.duration,
    starred: data.starred,
    explicit: data.explicitStatus != '',
    label: data.tags?.recordlabel || [],
    size: data.size,
    imported: data.importedAt
  }
}

export async function getAlbum(session: session, id: string): Promise<album_full> {
  const res = await request(session, "getAlbum", { id });

  const album = res.album;
  console.info('album req', album);

  const art = getCoverArt(session, album.coverArt);
  const album_artist = album.artists[0];

  const songs: Record<string, song[]> = {};
  const songsList: song[] = [];
  /* @ts-expect-error guhh */
  album.song.forEach(song => {
    const songArt = getCoverArt(session, song.coverArt);

    let artists = [];
    /* @ts-expect-error guhh */
    const unrelated = [];

    /* @ts-expect-error guhh */
    song.contributors?.forEach(contrib => {
      unrelated.push(contrib.artist.id);
    });

    /* @ts-expect-error guhh */
    song.artists.forEach(artist => {
      //if (artist.name == composer || display.includes(artist.name)) return;
      /* @ts-expect-error guhh */
      if (unrelated.includes(artist.id)) return;

      artists.push(artist);
    });

    if (artists.length == 0) {
      artists = song.artists;
    }

    const disc = song.discNumber || 0;

    if (!songs[disc]) songs[disc] = [];

    const newSong = {
      id: song.id,
      name: song.title,
      artists,
      duration: song.duration,
      played: song.played,
      plays: song.playCount,
      created: song.created,
      comment: song.comment,
      contentType: song.contentType,
      bitDepth: song.bitDepth,
      bitRate: song.bitRate,
      bpm: song.bpm,
      channelCount: song.channelCount,
      explicit: song.explicitStatus != '',
      genres: song.genres,
      index: song.track,
      suffix: song.suffix,
      path: song.path,
      url: createStreamURL(song.id, session),
      albumId: song.albumId,
      art: songArt,
      starred: song.starred
    }

    songsList.push(newSong);
    songs[disc].push(newSong);
  });

  const type = album.isCompilation ? 'compilation' : album.releaseTypes[0]?.toLowerCase().trim() || 'album';

  return {
    id: album.id,
    name: album.name,
    artists: album.artists,
    art: art,
    songs,
    songsList: songsList,
    songCount: album.songCount,
    played: album.played,
    plays: album.plays,
    type,
    genres: album.genres,
    duration: album.duration,
    discTitles: album.discTitles,
    year: album.year,
    explicit: album.explicitStatus != '',
    created: ''
  };
}

export async function getAlbumInfo(session: session, id: string) {
  const res = await request(session, "getAlbumInfo2", { id });

  return res.albumInfo;
}
