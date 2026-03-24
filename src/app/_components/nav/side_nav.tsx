"use client";

import styles from "./side_nav.module.css";
import { SakuraButton } from '../button/button';
import { Disc, Heart, Music, Settings, SmartHome, Star } from 'tabler-icons-react';
import { usePathname } from 'next/navigation';

export function SideNav() {
  const path = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <SakuraButton elem="link" href="/" identify="tab" primary={path == '/'}>
          <SmartHome size={16} />
          Home
        </SakuraButton>
        <SakuraButton elem="link" href="/artists" identify="tab" primary={path.startsWith('/artist')}>
          <Star size={16} />
          Artists
        </SakuraButton>
        <SakuraButton elem="link" href="/albums" identify="tab" primary={path.startsWith('/album')}>
          <Disc size={16} />
          Albums
        </SakuraButton>
        <SakuraButton elem="link" href="/songs" identify="tab" primary={path.startsWith('/song')}>
          <Music size={16} />
          Songs
        </SakuraButton>
        <SakuraButton elem="link" href="/loved" identify="tab" primary={path.startsWith('/loved')}>
          <Heart size={16} />
          Loved
        </SakuraButton>
        <SakuraButton elem="link" href="/settings" identify="tab" primary={path.startsWith('/settings')}>
          <Settings size={16} />
          Settings
        </SakuraButton>
      </ul>
    </nav>
  );
}