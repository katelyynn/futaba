import { sanitiseReleaseType } from '@/tools/type.ts';
import type { album } from '@/types/album.ts';
import type { artist, artistFull, ArtistListV2 } from '@/types/artist.ts';
import { request, requestV2 } from './client.ts';
import type { session } from './client.ts';
import { getCoverArt } from './cover.ts';

export async function getArtistsV2(session: session, start = 0, end = 20, order = 'DESC', sort = 'recently_added') {
  const res = await requestV2(session, 'api/artist', {
    _start: start,
    _end: end,
    _order: order,
    _sort: sort
  });

  const artists: ArtistListV2[] = [];
  /* @ts-expect-error guhh */
  res.data.forEach(artist => {
    const art = getCoverArt(session, artist.id);

    if (sort == 'play_date' && !artist.playDate) return;
    if (sort == 'play_count' && !artist.playCount) return;

    artists.push({
      id: artist.id,
      name: artist.name,
      songs: artist.songCount,
      albums: artist.albumCount,
      played: artist.playDate,
      plays: artist.playCount,
      created: artist.createdAt,
      art,
      starred: artist.starred
    });
  });

  return artists;
}
export async function getArtistAlbumsV2(session: session, id: string, start = 0, end = 20, order = 'DESC', sort = 'recently_added') {
  const res = await requestV2(session, 'api/album', {
    _start: start,
    _end: end,
    _order: order,
    _sort: sort,
    artist_id: id
  });

  const albums: album[] = [];
  /* @ts-expect-error guhh */
  res.data.forEach(album => {
    const artists = album.participants.albumartist || [];
    const art = getCoverArt(session, album.id);

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
      starred: album.starred
    });
  });

  return albums;
}

export async function getArtists(session: session): Promise<artist[]> {
  const res = await request(session, "getArtists");

  /* @ts-expect-error guhh */
  return res.artists.index.flatMap(group =>
    /* @ts-expect-error guhh */
    group.artist.map(artist => ({
      id: artist.id,
      art: artist.artistImageUrl,
      name: artist.name,
      albums: artist.albumCount
    }))
  );
}

export async function getArtist(session: session, id: string): Promise<artistFull> {
  const res = await request(session, "getArtist", { id });

  const artist = res.artist;

  const albums: Record<string, album[]> = {};

  if (artist.album) {
    /* @ts-expect-error guhh */
    artist.album.forEach(album => {
      const art = getCoverArt(session, album.id);
      const type = album.isCompilation ? 'compilation' : album.releaseTypes[0]?.toLowerCase().trim() || 'album';
      const sortedType = sanitiseReleaseType(type);

      if (!albums[sortedType]) albums[sortedType] = [];
      albums[sortedType].push({
        id: album.id,
        name: album.name,
        artists: album.artists,
        duration: album.duration,
        songs: album.songCount,
        played: album.played,
        plays: album.plays,
        type,
        created: album.created,
        art: art,
        year: album.year,
        starred: album.starred,
        explicit: false
      });
    });
  }

  return {
    id: artist.id,
    name: artist.name,
    art: artist.artistImageUrl,
    albums,
    albumCount: artist.albumCount
  };
}
