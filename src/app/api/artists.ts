"use client";

import { request, session } from './client';

export async function getArtists(session: session) {
  console.log('getArtists');
  const res = await request(session, "getArtists");

  console.info('res', res);

  return res.artists.index.flatMap(group =>
    group.artist.map(artist => ({
      id: artist.id,
      name: artist.name
    }))
  );
}