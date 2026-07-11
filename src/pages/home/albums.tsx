import { SakuraAlbum, SakuraAlbumList } from '@/components/album/album.tsx';
import { ErrorHandler } from '@/errorHandler.tsx';
import { useSession } from '@/session.tsx';
import { useAlbumsV2 } from '@/hook/album.ts';

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
