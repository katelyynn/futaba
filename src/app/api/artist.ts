"use client";

import { request, session } from './client';
import { getCoverArt } from './cover';

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
  artist.album.forEach(album => {
    const art = getCoverArt(session, album.id);
    const type = album.isCompilation ? 'compilation' : album.releaseTypes[0]?.toLowerCase().trim() || 'album';

    if (!albums[type]) albums[type] = [];
    albums[type].push({
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
      date: album.releaseDate,
      year: album.year,
      starred: album.starred
    });
  });

  return {
    id: artist.id,
    name: artist.name,
    art: artist.artistImageUrl,
    albums,
    albumCount: artist.albumCount
  };
}