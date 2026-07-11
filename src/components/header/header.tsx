import styles from "./header.module.css";
import { SakuraImage } from '@/components/image/image.tsx';
import { Link } from 'react-router-dom';
import { releaseType } from '@/tools/type.ts';

interface SakuraBackgroundProps {
  art: string
}

export function SakuraBackground({
  art
}: SakuraBackgroundProps) {
  return (
    <div className={styles.background} style={{ backgroundImage: `url(${art})` }} />
  )
}

interface SakuraHeaderProps {
  art: string,
  name: string,
  artists?: { id: string, name: string, missing: boolean }[],
  type: 'artist' | 'album' | 'playlist'
}

export function SakuraHeader({
  art,
  name,
  artists,
  type
}: SakuraHeaderProps) {
  let text = 'Artist';
  if (type == 'album') {
    text = releaseType(type);
  } else if (type == 'playlist') {
    text = "Playlist";
  }

  return (
    <>
      <header className={styles.header}>
        <SakuraImage url={art} type={type} identify={styles.art} expand />
        <div className={styles.info}>
          <p className={styles.type}>{text}</p>
          <h1 className={styles.name}>{name}</h1>
          {artists && <h2 className={styles.artists}>{artists.map((artist, i) => <span className={styles.artist} key={i}><Link to={`/artist/${artist.id}`}>{artist.name}</Link>{i != artists.length - 1 && <p>,</p>}</span>)}</h2>}
        </div>
      </header>
    </>
  )
}
