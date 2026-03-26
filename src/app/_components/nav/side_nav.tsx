"use client";

import styles from "./side_nav.module.css";
import { SakuraButton } from '../button/button';
import { usePathname } from 'next/navigation';
import { AuthStatus } from './auth';
import { IconCarambola, IconDisc, IconHeart, IconMusic, IconSettingsFilled, IconSmartHome } from '@tabler/icons-react';
import { useSession } from '@/app/session';
import { useAlbums } from '@/app/hook/album';
import { ErrorHandler } from '@/app/errorHandler';
import { SakuraAlbumListSide, SakuraAlbumSide } from '../album/album';

export function SideNav() {
  const path = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <SakuraButton elem="link" href="/" identifyOwn="tab" primary={path == '/'}>
          <IconSmartHome size={16} />
          Home
        </SakuraButton>
        <SakuraButton elem="link" href="/artists" identifyOwn="tab" primary={path.startsWith('/artist')}>
          <IconCarambola size={16} />
          Artists
        </SakuraButton>
        <SakuraButton elem="link" href="/albums" identifyOwn="tab" primary={path.startsWith('/album')}>
          <IconDisc size={16} />
          Albums
        </SakuraButton>
        <SakuraButton elem="link" href="/songs" identifyOwn="tab" primary={path.startsWith('/song')}>
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
      <AuthStatus />
    </nav>
  );
}

export function SideAlbumList() {
  const { session } = useSession();

  const { data, isLoading, error } = useAlbums(session, 10);

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