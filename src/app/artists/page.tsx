"use client";

import { SakuraArtist } from '../_components/artist/artist';
import { useArtists } from '../hook/artist';
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
        <SakuraArtist artist={artist} key={artist.id} />
      ))}
    </div>
  )
}