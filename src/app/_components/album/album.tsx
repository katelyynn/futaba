import styles from "./album.module.css";
import { SakuraImage } from '../image/image';
import Link from 'next/link';
import { album } from '@/app/types/album';
import React from 'react';
import { releaseType } from '@/app/tools/type';
import { DateTime } from "luxon";
import { useSession } from '@/app/session';
import { usePlayer } from '@/app/api/player';
import { usePathname } from 'next/navigation';
import { song } from '@/app/types/song';
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';

export function SakuraAlbum({ album, showArtist = false }: { album: album, showArtist?: boolean }) {
  return (
    <Link href={`/album/${album.id}`} className={styles.album}>
      <SakuraImage url={album.art} type="album" identify={styles.art} />
      <div className={styles.info}>
        <strong className={styles.name}>{album.name}</strong>
        {showArtist && <span className={styles.artists}>{album.artists.map(artist => <p className={styles.artist} key={artist.id}>{artist.name}</p>)}</span>}
        <p className={styles.meta}>{album.songs} songs</p>
        {album.type && <p className={styles.meta}>{releaseType(album.type)}</p>}
        <p className={styles.meta}>{album.year}</p>
        {album.played && <p className={styles.meta}>{DateTime.fromISO(album.played).toRelative()}</p>}
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

export function SakuraAlbumSide({ album, showArtist = false }: { album: album, showArtist?: boolean }) {
  const { session } = useSession();

  const currentSong: song = usePlayer(s => s.currentSong);
  const nowPlaying: boolean = usePlayer(s => s.nowPlaying);
  const path = usePathname();

  return (
    <Link href={`/album/${album.id}`} className={`${styles.albumSide} ${path.startsWith(`/album/${album.id}`) && styles.primary}`}>
      <SakuraImage url={album.art} type="album" identify={styles.art} />
      <div className={styles.info}>
        <strong className={styles.name}>{album.name}</strong>
        {showArtist && <span className={styles.artists}>{album.artists.map(artist => <p className={styles.artist} key={artist.id}>{artist.name}</p>)}</span>}
        {album.type && <p className={styles.meta}>{releaseType(album.type)}</p>}
        {album.played && <p className={styles.meta}>{DateTime.fromISO(album.played).toRelative()}</p>}
      </div>
      {(currentSong.albumId == album.id) ? (nowPlaying) ? <IconPlayerPauseFilled size={16} className={`${styles.activeIndicator} ${styles.activeIndicatorPlaying}`} /> : <IconPlayerPlayFilled size={16} className={styles.activeIndicator} /> : <></>}
    </Link>
  )
}

export function SakuraAlbumListSide({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.listSide}>
      {children}
    </div>
  )
}