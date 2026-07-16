import styles from "./header.module.css";
import { SakuraButton } from '@/components/button/button.tsx';
import { usePlayer } from '@/api/player.ts';
import { IconHeart, IconHeartFilled, IconPlayerPlayFilled, IconPlaylistAdd, IconShare } from '@tabler/icons-react';
import { useSession } from '@/session.tsx';
import { useSettings } from '@/api/settings.ts';
import { copy } from '@/tools/clipboard.ts';
import type { song } from '@/types/song.ts';
import { setLove } from "@/api/love.ts";
import type { session } from "@/api/client.ts";

interface SakuraActionsProps {
  id: string,
  songs: song[],
  count: number,
  type: 'artist' | 'album' | 'playlist',
  loved?: boolean,
  setLoved?: (loved: boolean) => void
}

export function SakuraActions({
  id,
  songs,
  count,
  type,
  loved,
  setLoved
}: SakuraActionsProps) {
  const { session } = useSession();
  if (!session) return;

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
              addToQueue(songs, null, false);
              play(songs[0], session!);
            }}>
              <IconPlayerPlayFilled size={16} />
              Play
            </SakuraButton>
            <SakuraButton elem="button" identify={styles.button} onClick={() => {
              addToQueue(songs);
            }}>
              <IconPlaylistAdd size={16} />
              Queue
            </SakuraButton>
          </>
        ) : (type == 'playlist' && count > 0) ? (
          <>
            <SakuraButton elem="button" identify={styles.button} primary onClick={() => {
              clearQueue();
              addToQueue(songs, null, false);
              play(songs[0], session!);
            }}>
              <IconPlayerPlayFilled size={16} />
              Play
            </SakuraButton>
            <SakuraButton elem="button" identify={styles.button} onClick={() => {
              addToQueue(songs);
            }}>
              <IconPlaylistAdd size={16} />
              Queue
            </SakuraButton>
          </>
        ) : <></>}
        {(loved != null && setLoved) && <LoveButton loved={loved} setLoved={setLoved} id={id} session={session} type={type} />}
        <SakuraButton elem="button" identify={styles.button} onClick={() => copy(globalThis.location.href)}>
          <IconShare size={16} />
          Share
        </SakuraButton>
      </div>
    </>
  )
}

interface LoveButtonProps {
  id: string,
  type: 'artist' | 'album' | 'playlist',
  session: session,
  loved: boolean,
  setLoved: (loved: boolean) => void
}

function LoveButton({
  id,
  type,
  session,
  loved,
  setLoved
}: LoveButtonProps) {
  return (
    <SakuraButton elem="button" identify={styles.button} primary={loved} onClick={async () => {
      const currentState = loved;
      const newState = !currentState;

      try {
        await setLove(session!, id, currentState, type);

        setLoved(newState);
      } catch {
        setLoved(currentState);
      }
    }}>
      {loved ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
      Love
    </SakuraButton>
  )
}
