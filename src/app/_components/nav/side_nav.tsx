"use client";

import styles from "./side_nav.module.css";
import { SakuraButton } from '../button/button';
import { usePathname } from 'next/navigation';
import { IconCarambola, IconDisc, IconHeart, IconMusic, IconSettingsFilled, IconSmartHome } from '@tabler/icons-react';
import { useSession } from '@/app/session';
import { useAlbums } from '@/app/hook/album';
import { ErrorHandler } from '@/app/errorHandler';
import { SakuraAlbumListSide, SakuraAlbumSide } from '../album/album';
import { usePlayer } from '@/app/api/player';
import { usePlaylists } from '@/app/hook/playlist';
import { SakuraPlaylistListSide, SakuraPlaylistSide } from '../playlist/playlist';

export function SideNav() {
  const path = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <SakuraButton elem="link" href="/" identifyOwn="tab" primary={path == '/'}>
          <IconSmartHome size={16} />
          Home
        </SakuraButton>
        <SakuraButton elem="link" href="/artists" identifyOwn="tab" primary={path.startsWith('/artists')}>
          <IconCarambola size={16} />
          Artists
        </SakuraButton>
        <SakuraButton elem="link" href="/albums" identifyOwn="tab" primary={path.startsWith('/albums')}>
          <IconDisc size={16} />
          Albums
        </SakuraButton>
        <SakuraButton elem="link" href="/songs" identifyOwn="tab" primary={path.startsWith('/songs')}>
          <IconMusic size={16} />
          Songs
        </SakuraButton>
        <SakuraButton elem="link" href="/loved" identifyOwn="tab" primary={path.startsWith('/loved')}>
          <IconHeart size={16} />
          Loved
        </SakuraButton>
        <SakuraButton elem="link" href="/settings" identifyOwn="tab" primary={path.startsWith('/settings')}>
          <IconSettingsFilled size={16} />
          Settings
        </SakuraButton>
      </ul>
      <SideAlbumList />
      <SidePlaylistList />
    </nav>
  );
}

export function SideAlbumList() {
  const { session } = useSession();

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

export function SidePlaylistList() {
  const { session } = useSession();

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