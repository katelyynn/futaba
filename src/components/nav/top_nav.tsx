import styles from "./top_nav.module.css";
import { SakuraButton } from '@/components/button/button.tsx';
import { IconChevronLeft, IconChevronRight, IconFolderSearch, IconLogout, IconMinus, IconSearch, IconSettingsFilled, IconSquare, IconUser, IconUserQuestion, IconX } from '@tabler/icons-react';
import { SakuraTooltip } from '@/components/tooltip/tooltip.tsx';
import { useSession } from '@/session.tsx';
import { startScan } from '@/api/scan.ts';
import { SakuraInput } from '@/components/input/input.tsx';
import { SakuraMenu } from '@/components/menu/menu.tsx';
import { Futaba } from '@/components/logo/logo.tsx';
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export function TopNav() {
  const { session } = useSession();
  const navigate = useNavigate();
  const iconSize = 16;

  const search = useRef<HTMLInputElement>(null);

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
        <SakuraInput ref={search} className={styles.search} placeholder="Search" onEnter={(val: string) => {
          navigate(`/search?query=${encodeURIComponent(val)}`);
        }} />
        <SakuraButton elem="button" identify={styles.searchBtn} onClick={() => {
          if (!search.current) return;
          navigate(`/search?query=${encodeURIComponent(search.current.value)}`);
          search.current.focus();
        }}>
          <IconSearch size={14} className={styles.searchIcon} />
        </SakuraButton>
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
        <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.minimise}`}>
          <IconMinus size={14} />
        </SakuraButton>
        <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.maximise}`}>
          <IconSquare size={12} />
        </SakuraButton>
        <SakuraButton elem="button" identify={`${styles.windowControl} ${styles.close}`}>
          <IconX size={16} />
        </SakuraButton>
      </div>
    </nav>
  );
}

export function AuthStatus() {
  const { session } = useSession();

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
