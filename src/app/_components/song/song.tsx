import styles from "./song.module.css";
import Link from 'next/link';
import { song } from '@/app/types/song';
import React from 'react';
import { duration } from '@/app/tools/duration';

export function SakuraSongList({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.list}>
      {children}
    </div>
  )
}

export function SakuraSong({ song }: { song: song }) {
  return (
    <div className={styles.song}>
      <p className={styles.index}>{song.index}</p>
      <div className={styles.info}>
        <strong className={styles.name}>{song.name}</strong>
        <div className={styles.artists}>
          {song.artists.map(artist => <Link href={`/artist/${artist.id}`} key={artist.id}>{artist.name}</Link>)}
        </div>
      </div>
      <p className={styles.duration}>{duration(song.duration)}</p>
    </div>
  )
}