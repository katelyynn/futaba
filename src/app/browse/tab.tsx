"use client";

import styles from "./tab.module.css";
import { usePathname } from 'next/navigation';
import { IconCarambola, IconDiscFilled, IconHeart, IconListSearch, IconSmartHome } from '@tabler/icons-react';
import { SakuraButton } from "../_components/button/button";

export function BrowseTabs() {
  const path = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <SakuraButton elem="link" href="/albums" identifyOwn="tab2" primary={path == '/albums'}>
          <IconDiscFilled size={14} />
          Albums
        </SakuraButton>
        <SakuraButton elem="link" href="/artists" identifyOwn="tab2" primary={path == '/artists'}>
          <IconCarambola size={14} />
          Artists
        </SakuraButton>
      </ul>
    </nav>
  );
}
