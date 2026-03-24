import styles from "./song.module.css";
import Link from 'next/link';
import { song } from '@/app/types/song';

export function SakuraSong({ song }: { song: song }) {
  return (
    <Link href={`/song/${song.id}`} className={styles.song}>
      <div className={styles.info}>
        <strong className={styles.name}>{song.name}</strong>
      </div>
    </Link>
  )
}