import styles from "./image.module.css";

interface SakuraImageProps {
  url: string,
  type: 'artist' | 'album' | 'track' | 'user' | 'other'
}

export function SakuraImage({
  url,
  type = 'other'
}: SakuraImageProps) {
  return (
    <div className={styles.image}>
      <img src={url} alt="something" />
    </div>
  );
}