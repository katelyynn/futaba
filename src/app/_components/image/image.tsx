import { forwardRef } from 'react';
import styles from "./image.module.css";

interface SakuraImageProps {
  url?: string,
  type?: 'artist' | 'album' | 'track' | 'user' | 'other',
  identify?: string
}

export const SakuraImage = forwardRef<HTMLDivElement, SakuraImageProps>(
  ({
    url,
    type = 'other',
    identify
  }, ref) => {
    return (
      <div ref={ref} className={`${styles.image} ${identify && identify}`}>
        <img src={url} alt="something" />
      </div>
    );
  }
)

SakuraImage.displayName = "SakuraImage";