import styles from "./song.module.css";
import Link from 'next/link';
import { song } from '@/app/types/song';
import React from 'react';
import { parseDuration } from '@/app/tools/duration';
import { usePlayer } from '@/app/api/player';
import { SakuraButton } from '../button/button';
import { PlayerPlay } from 'tabler-icons-react';

export function SakuraSongList({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.list}>
      {children}
    </div>
  )
}

export function SakuraSong({ song }: { song: song }) {
  const play = usePlayer(s => s.play);

  return (
    <div className={styles.song}>
      <p className={styles.index}>{song.index}</p>
      <div className={styles.info}>
        <strong className={styles.name}>{song.name}</strong>
        <div className={styles.artists}>
          {song.artists.map(artist => <Link href={`/artist/${artist.id}`} key={artist.id}>{artist.name}</Link>)}
        </div>
      </div>
      <div className={styles.actions}>
        <SakuraButton elem="button" identify={styles.action} onClick={() => play(song)}>
          <PlayerPlay size={16} />
        </SakuraButton>
      </div>
      <p className={styles.duration}>{parseDuration(song.duration)}</p>
    </div>
  )
}