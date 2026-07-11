import { useSettings } from '@/api/settings.ts';
import { SakuraButton } from '@/components/button/button.tsx';
import { SakuraTooltip } from '@/components/tooltip/tooltip.tsx';
import styles from "./fullscreen.module.css";
import { IconMinimize } from '@tabler/icons-react';
import { TopNav } from '@/components/nav/top_nav.tsx';
import { usePlayer } from '@/api/player.ts';

export function SakuraFullscreenView() {
  const setFullscreen = useSettings(s => s.setFullscreen);
  const currentSong = usePlayer(s => s.currentSong);

  return (
    <div>
      <TopNav />
      <p>fullscreen</p>
      <SakuraTooltip content="Fullscreen">
          <SakuraButton elem="button" identify={`${styles.action}`} onClick={() => {
            setFullscreen(false);
          }}>
            <IconMinimize size={16} />
          </SakuraButton>
        </SakuraTooltip>
    </div>
  )
}
