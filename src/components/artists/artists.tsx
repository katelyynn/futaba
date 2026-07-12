import { Link } from "react-router-dom";
import styles from "./artists.module.css";

interface SakuraArtistsProps {
  artists: { id: string, name: string }[],
  artistClass?: string
}

export function SakuraArtists({
  artists,
  artistClass
}: SakuraArtistsProps) {
  return (
    <span className={styles.artists}>
      {artists.map((artist, i) => (
        <span className={styles.artist} key={i}>
          <Link to={`/artist/${artist.id}`} className={`${styles.artistName} ${artistClass || ''}`}>{artist.name}</Link>{i != artists.length - 1 && <span className={styles.comma}>,</span>}
        </span>)
      )}
    </span>
  )
}
