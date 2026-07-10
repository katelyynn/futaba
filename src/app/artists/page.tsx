"use client";

import { Suspense } from 'react';
import { SakuraArtist, SakuraArtistList } from '../_components/artist/artist';
import { BrowseTabs } from '../browse/tab';
import { ErrorHandler } from '../errorHandler';
import { useArtists, useArtistsV2 } from '../hook/artist';
import { useSession } from '../session';

export default function Artists() {
  const { session } = useSession();

  const { data, isLoading, error } = useArtistsV2(session, 0, 100, 'DESC', 'play_date');
  if (isLoading || error || !data) return (
    <>
      <BrowseTabs />
    </>
  );

  console.log('artist data', data);

  return (
    <>
      <BrowseTabs />
      <SakuraArtistList>
        {data.map((artist, i) => (
          <SakuraArtist artist={artist} key={i} index={i} />
        ))}
      </SakuraArtistList>
    </>
  )
}
