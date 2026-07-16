import { SakuraAlbum, SakuraAlbumList } from '@/components/album/album.tsx';
import { BrowseTabs } from '@/pages/browse/tab.tsx';
import { useAlbums } from '@/hook/album.ts';
import { useSession } from '@/session.tsx';
import { useSettings } from "@/api/settings.ts";
import type { session } from "@/api/client.ts";
import { SakuraSelect } from "@/components/select/select.tsx";
import { SakuraTop, SakuraTopItem } from "@/components/tab/tab.tsx";

export default function Albums() {
  const { session } = useSession();
  if (!session) return;

  const { browseSort, setBrowseSort } = useSettings();

  return (
    <>
      <BrowseTabs />
      <SakuraTop>
        <SakuraTopItem label="Sort by">
          <SakuraSelect value={browseSort} onChange={setBrowseSort} values={{
            newest: "Newest",
            recent: "Recently listened",
            frequent: "Frequently listened",
            random: "Random",
            starred: "Loved",
            alphabeticalByName: "Name",
            alphabeticalByArtist: "Artist"
          }} />
        </SakuraTopItem>
      </SakuraTop>
      <AlbumsInner sort={browseSort} session={session} />
    </>
  )
}

function AlbumsInner({
  sort,
  session
}: { sort: string, session: session }) {
  const { data, isLoading, error } = useAlbums(session, 100, sort);
  if (isLoading || error || !data) return;

  return (
    <SakuraAlbumList>
      {data.map((album, i) => (
        <SakuraAlbum album={album} key={album.id} showArtist index={i} />
      ))}
    </SakuraAlbumList>
  )
}
