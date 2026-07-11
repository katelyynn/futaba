"use client";

import { SakuraAlbum, SakuraAlbumList } from '@/_components/album/album';
import { SakuraGroup, SakuraGroupList } from '@/_components/group/group';
import { SakuraActions } from '@/_components/header/actions';
import { SakuraBackground, SakuraHeader } from '@/_components/header/header';
import { SakuraPage, SakuraSeparator, SakuraSplit } from '@/_components/split/split';
import { ErrorHandler } from '@/errorHandler';
import { useSession } from '@/session';
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
  if (error || !data) return <ErrorHandler error={error || 'unknown'} />;

  return (
    <SakuraAlbumList single>
      {data.map((album, i) => (
        <SakuraAlbum album={album} key={i} index={i} showArtist sort={sort} />
      ))}
    </SakuraAlbumList>
  )
}
