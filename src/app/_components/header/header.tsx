import React from 'react';
import styles from "./header.module.css";
import { SakuraImage } from '../image/image';
import { artist } from '@/app/types/artist';
import { album, album_full } from '@/app/types/album';
import Link from 'next/link';
import { releaseType } from '@/app/tools/type';
import { playlistFull } from '@/app/types/playlist';

interface SakuraBackgroundProps {
  data: artist | album | playlistFull
}

export function SakuraBackground({
  data
}: SakuraBackgroundProps) {
  return (
    <div className={styles.background} style={{ backgroundImage: `url(${data.art})` }} />
  )
}

interface SakuraHeaderProps {
  data: artist | album | playlistFull,
  type: 'artist' | 'album' | 'playlist'
}

export function SakuraHeader({
  data,
  type
}: SakuraHeaderProps) {
  let text = 'Artist';
  if (type == 'album') {
    text = releaseType((data as album_full).type);
  } else if (type == 'playlist') {
    text = "Playlist";
  }

  return (
    <>
      <header className={styles.header}>
        <SakuraImage url={data.art} type={type} identify={styles.art} expand />
        <div className={styles.info}>
          <p className={styles.type}>{text}</p>
          <h1 className={styles.name}>{data.name}</h1>
          {type == 'album' && <h2 className={styles.artists}>{(data as album).artists.map((artist, i) => <span className={styles.artist} key={i}><Link href={`/artist/${artist.id}`}>{artist.name}</Link>{i != (data as album).artists.length - 1 && <p>,</p>}</span>)}</h2>}
        </div>
      </header>
    </>
  )
}
