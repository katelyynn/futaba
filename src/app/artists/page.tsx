"use client";

import { auth } from '../api/client';
import { useArtists } from '../hook/artists';

export default function Artists({ auth }: { auth: auth }) {
  const { data, isLoading, error } = useArtists(auth);

  if (isLoading) return <div>loading</div>;
  if (error) return <div>error</div>;

  return (
    <div>
      {data.map(artist => (
        <div key={artist.id}>{artist.name}</div>
      ))}
    </div>
  )
}