"use client";

import { sanitiseReleaseType } from '../tools/type';
import { ArtistListV2 } from '../types/artist';
import { request, requestV2, session } from './client';
import { getCoverArt } from './cover';

export async function getArtistsV2(session: session, start = 0, end = 20, order = 'DESC', sort = 'recently_added') {
  const res = await requestV2(session, 'api/artist', {
    _start: start,
    _end: end,
    _order: order,
    _sort: sort
  });

  console.info('artistv2', res);

  const artists: ArtistListV2[] = [];
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

export async function getArtists(session: session) {
  console.log('getArtists');
  const res = await request(session, "getArtists");

  console.info('res', res);

  return res.artists.index.flatMap(group =>
    group.artist.map(artist => ({
      id: artist.id,
      art: artist.artistImageUrl,
      name: artist.name,
      albums: artist.albumCount,
      roles: artist.roles
    }))
  );
}

export async function getArtist(session: session, id: string) {
  const res = await request(session, "getArtist", { id });

  const artist = res.artist;
  console.info('artist req', artist);

  const albums = {};

  if (artist.album) {
    artist.artist.forEach(album => {
      const art = getCoverArt(session, artist.id);
      const type = artist.isCompilation ? 'compilation' : artist.releaseTypes[0]?.toLowerCase().trim() || 'album';
      const sortedType = sanitiseReleaseType(type);

      if (!albums[sortedType]) albums[sortedType] = [];
      albums[sortedType].push({
        id: artist.id,
        name: artist.name,
        artists: artist.artists,
        duration: artist.duration,
        songs: artist.songCount,
        played: artist.played,
        plays: artist.plays,
        type,
        sortedType,
        created: artist.created,
        art: art,
        year: artist.year,
        starred: artist.starred
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
