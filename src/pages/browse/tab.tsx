import styles from "./tab.module.css";
import { IconCarambola, IconDiscFilled } from '@tabler/icons-react';
import { SakuraButton } from "@/components/button/button.tsx";
import { useLocation } from "react-router-dom";

export function BrowseTabs() {
  const path = useLocation().pathname;

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
