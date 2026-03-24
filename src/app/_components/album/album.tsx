import styles from "./album.module.css";
import { SakuraImage } from '../image/image';
import Link from 'next/link';
import { album } from '@/app/types/album';

export function SakuraAlbum({ album }: { album: album }) {
  return (
    <Link href={`/album/${album.id}`} className={styles.album}>
      <SakuraImage url={album.art} type="artist" />
      <div className={styles.info}>
        <strong className={styles.name}>{album.name}</strong>
        <p className={styles.meta}>{album.songs} songs</p>
      </div>
    </Link>
  )
}