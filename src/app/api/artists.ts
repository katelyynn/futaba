import { auth, request } from './client';

export async function getArtists(auth: auth) {
  const res = await request(auth, "getArtists");

  return res.artists.index.flatMap(group =>
    group.artist.map(artist => ({
      id: artist.id,
      name: artist.name
    }))
  );
}