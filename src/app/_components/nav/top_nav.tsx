"use client";

import Link from 'next/link';
import styles from "./top_nav.module.css";
import { SakuraButton } from '../button/button';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconFolderSearch, IconMaximize, IconMinus, IconSquare, IconX } from '@tabler/icons-react';
import { SakuraTooltip } from '../tooltip/tooltip';
import { useSession } from '@/app/session';
import { startScan } from '@/app/api/scan';

export function TopNav() {
  const { session } = useSession();
  const iconSize = 16;

  return (
    <nav className={styles.nav}>
      <div className={styles.main}>
        <div className={styles.controls}>
          <SakuraTooltip content="Back">
            <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.left}`} onClick={() => window.history.back()}>
              <IconChevronLeft size={iconSize} />
            </SakuraButton>
          </SakuraTooltip>
          <SakuraTooltip content="Forward">
            <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.right}`} onClick={() => window.history.forward()}>
              <IconChevronRight size={iconSize} />
            </SakuraButton>
          </SakuraTooltip>
        </div>
        <Link href="/">futaba</Link>
      </div>
      <div className={styles.controls}>
        <SakuraTooltip content="Start scan">
          <SakuraButton elem="button" identify={`${styles.windowControl}`} onClick={() => startScan(session!)}>
            <IconFolderSearch size={iconSize} />
          </SakuraButton>
        </SakuraTooltip>
        <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.minimise}`} onClick={() => window.windowControls.minimise()}>
          <IconMinus size={14} />
        </SakuraButton>
        <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.maximise}`} onClick={() => window.windowControls.maximise()}>
          <IconSquare size={12} />
        </SakuraButton>
        <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.close}`} onClick={() => window.windowControls.close()}>
          <IconX size={16} />
        </SakuraButton>
      </div>
    </nav>
  );
}