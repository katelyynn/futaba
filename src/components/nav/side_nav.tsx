import styles from "./side_nav.module.css";
import { SakuraButton } from '@/components/button/button.tsx';
import { IconHeart, IconListSearch, IconSmartHome } from '@tabler/icons-react';
import { useSession } from '@/session.tsx';
import { useAlbums } from '@/hook/album.ts';
import { ErrorHandler } from '@/errorHandler.tsx';
import { SakuraAlbumListSide, SakuraAlbumSide } from '@/components/album/album.tsx';
import { usePlayer } from '@/api/player.ts';
import { usePlaylists } from '@/hook/playlist.ts';
import { SakuraPlaylistListSide, SakuraPlaylistSide } from '@/components/playlist/playlist.tsx';
import type { session } from "@/api/client.ts";
import type { playlist } from "@/types/playlist.ts";
import { useLocation } from "react-router-dom";

export function SideNav() {
  const path = useLocation().pathname;
  const { session } = useSession();

  if (!session) return <></>;

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <ul className={styles.list}>
          <SakuraButton elem="link" href="/" identifyOwn="tab" primary={path == '/'}>
            <IconSmartHome size={16} />
            Home
          </SakuraButton>
          <SakuraButton elem="link" href="/albums" identifyOwn="tab" primary={path.startsWith('/albums') || path.startsWith('/artists') || path.startsWith('/songs')}>
            <IconListSearch size={16} />
            Browse
          </SakuraButton>
          <SakuraButton elem="link" href="/loved" identifyOwn="tab" primary={path.startsWith('/loved')}>
            <IconHeart size={16} />
            Loved
          </SakuraButton>
        </ul>
        <SideAlbumList session={session} />
        <SidePlaylistList session={session} />
      </div>
    </nav>
  );
}

export function SideAlbumList({
  session
}: { session: session }) {
  const currentSong = usePlayer(s => s.currentSong);

  const { data, isLoading, error } = useAlbums(session, 10, "recent", currentSong?.id || '');

  if (isLoading) return <div>loading</div>;
  if (error || !data) return <ErrorHandler error={error || 'unknown'} />;

  console.log('album data', data);

  return (
    <SakuraAlbumListSide>
      {data.map(album => (
        <SakuraAlbumSide album={album} key={album.id} />
      ))}
    </SakuraAlbumListSide>
  )
}

export function SidePlaylistList({
  session
}: { session: session }) {
  const { data, isLoading, error } = usePlaylists(session);

  if (isLoading) return <div>loading</div>;
  if (error || !data) return <ErrorHandler error={error || 'unknown'} />;

  return (
    <SakuraPlaylistListSide>
      {data.map((playlist: playlist) => (
        <SakuraPlaylistSide playlist={playlist} key={playlist.id} />
      ))}
    </SakuraPlaylistListSide>
  )
}
