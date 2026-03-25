import styles from "./album.module.css";
import { SakuraImage } from '../image/image';
import Link from 'next/link';
import { album } from '@/app/types/album';
import React from 'react';
import { releaseType } from '@/app/tools/type';

export function SakuraAlbum({ album, showArtist = false }: { album: album, showArtist?: boolean }) {
  return (
    <Link href={`/album/${album.id}`} className={styles.album}>
      <SakuraImage url={album.art} type="album" identify={styles.art} />
      <div className={styles.info}>
        <strong className={styles.name}>{album.name}</strong>
        {showArtist && <span className={styles.artists}>{album.artists.map(artist => <p className={styles.artist} key={artist.id}>{artist.name}</p>)}</span>}
        <p className={styles.meta}>{album.songs} songs</p>
        <p className={styles.meta}>{releaseType(album.type)}</p>
        <p className={styles.meta}>{album.year}</p>
      </div>
    </Link>
  )
}

export function SakuraAlbumList({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.list}>
      {children}
    </div>
  )
}