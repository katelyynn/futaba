"use client";

import { Suspense } from 'react';
import { SakuraArtist, SakuraArtistList } from '../_components/artist/artist';
import { BrowseTabs } from '../browse/tab';
import { ErrorHandler } from '../errorHandler';
import { useArtists, useArtistsV2 } from '../hook/artist';
import { useSession } from '../session';

export default function Artists() {
  const { session } = useSession();

  const { data, isLoading, error } = useArtistsV2(session, 0, 100, 'ASC', 'play_date');

  console.log('artist data', data);

  return (
    <>
      <BrowseTabs />
      <Suspense>
        <SakuraArtistList>
          {data.map((artist, i) => (
            <SakuraArtist artist={artist} key={artist.id} index={i} />
          ))}
        </SakuraArtistList>
      </Suspense>
    </>
  )
}
