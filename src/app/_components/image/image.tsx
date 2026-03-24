import styles from "./image.module.css";

interface SakuraImageProps {
  url: string,
  type?: 'artist' | 'album' | 'track' | 'user' | 'other',
  identify?: string
}

export function SakuraImage({
  url,
  type = 'other',
  identify
}: SakuraImageProps) {
  return (
    <div className={`${styles.image} ${identify && identify}`}>
      <img src={url} alt="something" />
    </div>
  );
}