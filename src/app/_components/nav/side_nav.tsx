"use client";

import styles from "./side_nav.module.css";
import { SakuraButton } from '../button/button';
import { usePathname } from 'next/navigation';
import { IconCarambola, IconDisc, IconHeart, IconListSearch, IconMusic, IconSettingsFilled, IconSmartHome } from '@tabler/icons-react';
import { useSession } from '@/app/session';
import { useAlbums } from '@/app/hook/album';
import { ErrorHandler } from '@/app/errorHandler';
import { SakuraAlbumListSide, SakuraAlbumSide } from '../album/album';
import { usePlayer } from '@/app/api/player';
import { usePlaylists } from '@/app/hook/playlist';
import { SakuraPlaylistListSide, SakuraPlaylistSide } from '../playlist/playlist';
import { session } from "@/app/api/client";

export function SideNav() {
  const path = usePathname();
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

  const { data, isLoading, error } = useAlbums(session, 10, currentSong.id);

  if (isLoading) return <div>loading</div>;
  if (error) return <ErrorHandler error={error} />;

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
  if (error) return <ErrorHandler error={error} />;

  return (
    <SakuraPlaylistListSide>
      {data.map(playlist => (
        <SakuraPlaylistSide playlist={playlist} key={playlist.id} />
      ))}
    </SakuraPlaylistListSide>
  )
}
