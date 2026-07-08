"use client";

import { SakuraArtist, SakuraArtistList } from '../_components/artist/artist';
import { ErrorHandler } from '../errorHandler';
import { useArtists } from '../hook/artist';
import { useSession } from '../session';

export default function Artists() {
  const { session } = useSession();

  const { data, isLoading, error } = useArtists(session);

  if (isLoading) return <div>loading</div>;
  if (error) return <ErrorHandler error={error} />

  console.log('artist data', data);

  return (
    <SakuraArtistList>
      {data.map((artist, i) => (
        <SakuraArtist artist={artist} key={artist.id} index={i} />
      ))}
    </SakuraArtistList>
  )
}
