import { SakuraAlbum, SakuraAlbumList } from '@/components/album/album.tsx';
import { BrowseTabs } from '@/pages/browse/tab.tsx';
import { useAlbums } from '@/hook/album.ts';
import { useSession } from '@/session.tsx';

export default function Albums() {
  const { session } = useSession();

  const { data, isLoading, error } = useAlbums(session);
  if (isLoading || error || !data) return (
    <>
      <BrowseTabs />
    </>
  );

  console.log('album data', data);

  return (
    <>
      <BrowseTabs />
      <SakuraAlbumList>
        {data.map((album, i) => (
          <SakuraAlbum album={album} key={album.id} showArtist index={i} />
        ))}
      </SakuraAlbumList>
    </>
  )
}
