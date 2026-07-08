import { forwardRef } from 'react';
import styles from "./image.module.css";
import { SakuraDialog } from '../dialog/dialog';

interface SakuraImageProps {
  url?: string,
  type?: 'artist' | 'album' | 'track' | 'user' | 'other' | 'playlist',
  identify?: string,
  expand?: boolean
}

export const SakuraImage = forwardRef<HTMLDivElement, SakuraImageProps>(
  ({
    url,
    type = 'other',
    identify,
    expand = false
  }, ref) => {
    if (expand) {
      return (
        <SakuraDialog title={'avatar'} content={(
          <img src={url} alt="something" />
        )}>
          <div ref={ref} className={`${styles.image} ${identify && identify}`}>
            <img src={`${url}&size=300`} alt="something" />
          </div>
        </SakuraDialog>
      )
    }

    return (
      <div ref={ref} className={`${styles.image} ${identify && identify}`}>
        <img src={`${url}&size=300`} alt="something" />
      </div>
    );
  }
)

SakuraImage.displayName = "SakuraImage";
