"use client";

import { SakuraAlbum, SakuraAlbumList } from '@/app/_components/album/album';
import { SakuraGroup, SakuraGroupList } from '@/app/_components/group/group';
import { SakuraActions } from '@/app/_components/header/actions';
import { SakuraBackground, SakuraHeader } from '@/app/_components/header/header';
import { SakuraPage, SakuraSeparator, SakuraSplit } from '@/app/_components/split/split';
import { ErrorHandler } from '@/app/errorHandler';
import { useSession } from '@/app/session';
import { useAlbumsV2 } from '../hook/album';

interface AlbumsListProps {
  order: string,
  sort: string
}

export function AlbumsList({
  order,
  sort
}: AlbumsListProps) {
  const { session } = useSession();

  const { data, isLoading, error } = useAlbumsV2(session, 0, 20, order, sort);

  if (isLoading) return <div>loading</div>;
  if (error) return <ErrorHandler error={error} />;

  return (
    <SakuraAlbumList single>
      {data.map((album, i) => (
        <SakuraAlbum album={album} key={album.id} index={i} showArtist />
      ))}
    </SakuraAlbumList>
  )
}
