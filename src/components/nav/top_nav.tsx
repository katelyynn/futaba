"use client";

import Link from 'react-router-dom';
import styles from "./top_nav.module.css";
import { SakuraButton } from '../button/button';
import { IconChevronLeft, IconChevronRight, IconFolderSearch, IconLogout, IconMinus, IconSettingsFilled, IconSquare, IconUser, IconUserQuestion, IconX } from '@tabler/icons-react';
import { SakuraTooltip } from '../tooltip/tooltip';
import { useSession } from '@/session';
import { startScan } from '@/api/scan';
import { SakuraInput } from '../input/input';
import { useRouter } from 'next/navigation';
import { SakuraMenu } from '../menu/menu';
import { Futaba } from '../logo/logo';

declare global {
  interface Window {
    windowControls: {
      minimise: () => void,
      maximise: () => void,
      close: () => void
    }
  }
}

export function TopNav() {
  const { session } = useSession();
  const router = useRouter();
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
        <Futaba />
      </div>
      <div className={styles.searchHolder}>
        <SakuraInput className={styles.search} placeholder="Search" onEnter={(val: string) => {
          router.push(`/search?query=${encodeURIComponent(val)}`);
        }} />
      </div>
      <div className={`${styles.controls} ${styles.windowControls}`}>
        <AuthStatus />
        <SakuraTooltip content="Start scan">
          <SakuraButton elem="button" identify={`${styles.windowControl}`} onClick={() => startScan(session!)}>
            <IconFolderSearch size={iconSize} />
          </SakuraButton>
        </SakuraTooltip>
        <SakuraTooltip content="Settings">
          <SakuraButton elem="link" identify={`${styles.windowControl}`} href="/settings">
            <IconSettingsFilled size={iconSize} />
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

export function AuthStatus() {
  const { session, setSession } = useSession();

  if (!session) {
    return (
      <SakuraButton elem="link" href="/auth/login" identify={`${styles.windowControl}`}>
        <IconUserQuestion size={16} />
        Not logged in
      </SakuraButton>
    );
  }

  return (
    <SakuraMenu content={(
      <SakuraButton elem="link" identifyOwn="menu" href="/auth/logout">
        <IconLogout size={16} />
        Logout
      </SakuraButton>
    )}>
      <SakuraButton elem="button" identify={`${styles.windowControl}`}>
        <IconUser size={16} />
        {session.username}
      </SakuraButton>
    </SakuraMenu>
  )
}
