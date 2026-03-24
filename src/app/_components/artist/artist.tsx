import { artist } from '@/app/types/artist';
import styles from "./artist.module.css";
import { SakuraImage } from '../image/image';
import Link from 'next/link';

export function SakuraArtist({ artist }: { artist: artist }) {
  return (
    <Link href={`/artist/${artist.id}`} className={styles.artist}>
      <SakuraImage url={artist.art} type="artist" />
      <div className={styles.info}>
        <strong className={styles.name}>{artist.name}</strong>
        <p className={styles.meta}>{artist.albums} albums</p>
      </div>
    </Link>
  )
}