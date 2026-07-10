import React from 'react';
import styles from "./header.module.css";
import { SakuraButton } from '../button/button';
import { usePlayer } from '@/app/api/player';
import { IconPlayerPlayFilled, IconPlaylistAdd, IconShare } from '@tabler/icons-react';
import { useSession } from '@/app/session';
import { useSettings } from '@/app/api/settings';
import { copy } from '@/app/tools/clipboard';
import { song } from '@/app/types/song';

interface SakuraActionsProps {
  songs: song[],
  count: number,
  type: 'artist' | 'album' | 'playlist'
}

export function SakuraActions({
  songs,
  count,
  type
}: SakuraActionsProps) {
  const { session } = useSession();
  const toScrobble = useSettings(s => s.scrobble);

  const clearQueue = usePlayer(s => s.clearQueue);
  const addToQueue = usePlayer(s => s.addToQueue);
  const play = usePlayer(s => s.play);

  return (
    <>
      <div className={styles.buttons}>
        {(type == 'album' && count > 0) ? (
          <>
            <SakuraButton elem="button" identify={styles.button} primary onClick={() => {
              clearQueue();
              addToQueue(songs);
              play(songs[0], session!, toScrobble);
            }}>
              <IconPlayerPlayFilled size={16} />
              Play
            </SakuraButton>
            <SakuraButton elem="button" identify={styles.button} onClick={() => {
              addToQueue(songs);
            }}>
              <IconPlaylistAdd size={16} />
              Add to queue
            </SakuraButton>
          </>
        ) : (type == 'playlist' && count > 0) ? (
          <>
            <SakuraButton elem="button" identify={styles.button} primary onClick={() => {
              clearQueue();
              addToQueue(songs);
              play(songs[0], session!, toScrobble);
            }}>
              <IconPlayerPlayFilled size={16} />
              Play
            </SakuraButton>
            <SakuraButton elem="button" identify={styles.button} onClick={() => {
              addToQueue(songs);
            }}>
              <IconPlaylistAdd size={16} />
              Add to queue
            </SakuraButton>
          </>
        ) : <></>}
        <SakuraButton elem="button" identify={styles.button} onClick={() => copy(window.location.href)}>
          <IconShare size={16} />
          Share
        </SakuraButton>
      </div>
    </>
  )
}
