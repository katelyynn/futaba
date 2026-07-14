import styles from "./header.module.css";
import { SakuraButton } from '@/components/button/button.tsx';
import { usePlayer } from '@/api/player.ts';
import { IconPlayerPlayFilled, IconPlaylistAdd, IconShare } from '@tabler/icons-react';
import { useSession } from '@/session.tsx';
import { useSettings } from '@/api/settings.ts';
import { copy } from '@/tools/clipboard.ts';
import type { song } from '@/types/song.ts';

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
              play(songs[0], session!);
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
              play(songs[0], session!);
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
