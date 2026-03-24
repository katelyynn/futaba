import React from 'react';
import styles from "./header.module.css";
import { SakuraImage } from '../image/image';
import { artist } from '@/app/types/artist';
import { album } from '@/app/types/album';
import Link from 'next/link';
import { releaseType } from '@/app/tools/type';

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
    text = releaseType((data as album).type);
  }

  return (
    <header className={styles.header}>
      <SakuraImage url={data.art} type={type} identify={styles.art} />
      <div className={styles.info}>
        <p className={styles.type}>{text}</p>
        <h1 className={styles.name}>{data.name}</h1>
        {type == 'album' && <h2 className={styles.artists}>{(data as album).artists.map(artist => <Link href={`/artist/${artist.id}`} key={artist.id}>{artist.name}</Link>)}</h2>}
      </div>
    </header>
  )
}