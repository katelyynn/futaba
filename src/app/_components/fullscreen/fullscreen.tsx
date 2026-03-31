"use client";

import { useSettings } from '@/app/api/settings';
import { SakuraButton } from '../button/button';
import { SakuraTooltip } from '../tooltip/tooltip';
import styles from "./fullscreen.module.css";
import { IconMinimize } from '@tabler/icons-react';
import { TopNav } from '../nav/top_nav';
import { usePlayer } from '@/app/api/player';

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