"use client";

import { Suspense } from 'react';
import { SakuraAlbum, SakuraAlbumList } from '../_components/album/album';
import { SakuraArtist, SakuraArtistList } from '../_components/artist/artist';
import { BrowseTabs } from '../browse/tab';
import { ErrorHandler } from '../errorHandler';
import { useAlbums } from '../hook/album';
import { useSession } from '../session';

export default function Albums() {
  const { session } = useSession();

  const { data, isLoading, error } = useAlbums(session);

  console.log('album data', data);

  return (
    <>
      <BrowseTabs />
      <Suspense>
        <SakuraAlbumList>
          {data.map((album, i) => (
            <SakuraAlbum album={album} key={album.id} showArtist index={i} />
          ))}
        </SakuraAlbumList>
      </Suspense>
    </>
  )
}
