"use client";

import styles from "./side_nav.module.css";
import { SakuraButton } from '../button/button';
import { usePathname } from 'next/navigation';
import { IconCarambola, IconDisc, IconHeart, IconListSearch, IconMusic, IconSettingsFilled, IconSmartHome } from '@tabler/icons-react';
import { useSession } from '@/session';
import { useAlbums } from '@/hook/album';
import { ErrorHandler } from '@/errorHandler';
import { SakuraAlbumListSide, SakuraAlbumSide } from '../album/album';
import { usePlayer } from '@/api/player';
import { usePlaylists } from '@/hook/playlist';
import { SakuraPlaylistListSide, SakuraPlaylistSide } from '../playlist/playlist';
import { session } from "@/api/client";
import { playlist } from "@/types/playlist";

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

  const { data, isLoading, error } = useAlbums(session, 10, currentSong?.id || '');

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
