"use client";

import Link from 'next/link';
import styles from "./top_nav.module.css";
import { SakuraButton } from '../button/button';
import { ChevronDown, Maximize, X } from 'tabler-icons-react';

export function TopNav() {
  const iconSize = 16;

  return (
    <nav className={styles.nav}>
      <div className={styles.main}>
        <Link href="/">futaba</Link>
      </div>
      <div className={styles.controls}>
        <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.minimise}`} onClick={() => window.windowControls.minimise()}>
          <ChevronDown size={iconSize} />
        </SakuraButton>
        <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.maximise}`} onClick={() => window.windowControls.maximise()}>
          <Maximize size={iconSize} />
        </SakuraButton>
        <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.close}`} onClick={() => window.windowControls.close()}>
          <X size={iconSize} />
        </SakuraButton>
      </div>
    </nav>
  );
}