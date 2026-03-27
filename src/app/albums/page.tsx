"use client";

import { SakuraAlbum, SakuraAlbumList } from '../_components/album/album';
import { SakuraArtist, SakuraArtistList } from '../_components/artist/artist';
import { ErrorHandler } from '../errorHandler';
import { useAlbums } from '../hook/album';
import { useSession } from '../session';

export default function Albums() {
  const { session } = useSession();

  const { data, isLoading, error } = useAlbums(session);

  if (isLoading) return <div>loading</div>;
  if (error) return <ErrorHandler error={error} />

  console.log('album data', data);

  return (
    <SakuraAlbumList>
      {data.map(album => (
        <SakuraAlbum album={album} key={album.id} showArtist />
      ))}
    </SakuraAlbumList>
  )
}