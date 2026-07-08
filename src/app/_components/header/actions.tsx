import React from 'react';
import styles from "./header.module.css";
import { SakuraImage } from '../image/image';
import { artist } from '@/app/types/artist';
import { album, album_full } from '@/app/types/album';
import Link from 'next/link';
import { releaseType } from '@/app/tools/type';
import { SakuraButton } from '../button/button';
import { usePlayer } from '@/app/api/player';
import { IconPlayerPlayFilled, IconPlaylistAdd, IconShare } from '@tabler/icons-react';
import { useSession } from '@/app/session';
import { useSettings } from '@/app/api/settings';
import { copy } from '@/app/tools/clipboard';
import { playlistFull } from '@/app/types/playlist';

interface SakuraActionsProps {
  data: artist | album | playlistFull,
  type: 'artist' | 'album' | 'playlist'
}

export function SakuraActions({
  data,
  type
}: SakuraActionsProps) {
  let text = 'Artist';
  if (type == 'album') {
    text = releaseType((data as album_full).type);
  } else if (type == 'playlist') {
    text = "Playlist";
  }

  const { session } = useSession();
  const toScrobble = useSettings(s => s.scrobble);

  const clearQueue = usePlayer(s => s.clearQueue);
  const addToQueue = usePlayer(s => s.addToQueue);
  const play = usePlayer(s => s.play);

  return (
    <>
      <div className={styles.buttons}>
        {(type == 'album' && (data as album_full).songCount) ? (
          <>
            <SakuraButton elem="button" identify={styles.button} primary onClick={() => {
              clearQueue();
              addToQueue((data as album_full).songsList);
              play((data as album_full).songsList[0], session!, toScrobble);
            }}>
              <IconPlayerPlayFilled size={16} />
              Play
            </SakuraButton>
            <SakuraButton elem="button" identify={styles.button} onClick={() => {
              addToQueue((data as album_full).songsList);
            }}>
              <IconPlaylistAdd size={16} />
              Add to queue
            </SakuraButton>
          </>
        ) : (type == 'playlist' && (data as playlistFull).songCount) ? (
          <>
            <SakuraButton elem="button" identify={styles.button} primary onClick={() => {
              clearQueue();
              addToQueue((data as playlistFull).songs);
              play((data as playlistFull).songs[0], session!, toScrobble);
            }}>
              <IconPlayerPlayFilled size={16} />
              Play
            </SakuraButton>
            <SakuraButton elem="button" identify={styles.button} onClick={() => {
              addToQueue((data as playlistFull).songs);
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
