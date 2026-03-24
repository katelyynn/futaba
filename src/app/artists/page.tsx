"use client";

import { useArtists } from '../hook/artists';
import { useSession } from '../session';

export default function Artists() {
  const { session } = useSession();

  const { data, isLoading, error } = useArtists(session);

  if (isLoading) return <div>loading</div>;
  if (error) return <div>error</div>;

  console.log('artist data', data);

  return (
    <div>
      {data.map(artist => (
        <div key={artist.id}>{artist.name}</div>
      ))}
    </div>
  )
}