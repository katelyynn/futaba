import React from 'react';
import styles from "./header.module.css";
import { SakuraImage } from '../image/image';
import { artist } from '@/app/types/artist';
import { album, album_full } from '@/app/types/album';
import Link from 'next/link';
import { releaseType } from '@/app/tools/type';
import { SakuraButton } from '../button/button';
import { usePlayer } from '@/app/api/player';
import { IconPlayerPlayFilled, IconPlaylistAdd } from '@tabler/icons-react';
import { useSession } from '@/app/session';
import { useSettings } from '@/app/api/settings';

interface SakuraHeaderProps {
  data: artist | album,
  type: 'artist' | 'album'
}

export function SakuraHeader({
  data,
  type
}: SakuraHeaderProps) {
  let text = 'Artist';
  if (type == 'album') {
    text = releaseType((data as album_full).type);
  }

  const { session } = useSession();
  const toScrobble = useSettings(s => s.scrobble);

  const clearQueue = usePlayer(s => s.clearQueue);
  const addToQueue = usePlayer(s => s.addToQueue);
  const play = usePlayer(s => s.play);

  return (
    <>
      <header className={styles.header}>
        <SakuraImage url={data.art} type={type} identify={styles.art} />
        <div className={styles.info}>
          <p className={styles.type}>{text}</p>
          <h1 className={styles.name}>{data.name}</h1>
          {type == 'album' && <h2 className={styles.artists}>{(data as album).artists.map(artist => <Link href={`/artist/${artist.id}`} key={artist.id}>{artist.name}</Link>)}</h2>}
        </div>
      </header>
      <div className={styles.buttons}>
        {type == 'album' && (data as album_full).songs.length > 0 && (
          <>
            <SakuraButton elem="button" identify={styles.button} primary onClick={() => {
              clearQueue();
              addToQueue((data as album_full).songs);
              play((data as album_full).songs[0], session!, toScrobble);
            }}>
              <IconPlayerPlayFilled size={16} />
              Play
            </SakuraButton>
            <SakuraButton elem="button" identify={styles.button} onClick={() => {
              addToQueue((data as album_full).songs);
            }}>
              <IconPlaylistAdd size={16} />
              Add to queue
            </SakuraButton>
          </>
        )}
      </div>
    </>
  )
}