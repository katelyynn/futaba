import { useSettings } from '@/api/settings.ts';
import styles from "./aside.module.css";
import { SakuraQueue } from '@/components/player/queue.tsx';
import { SakuraSerif } from '@/components/serif/serif.tsx';
import { IconArticleFilled, IconMicrophone2 } from "@tabler/icons-react";

export function SakuraAside() {
  const asideView = useSettings(s => s.asideView);
  const showAsideView = useSettings(s => s.showAsideView);

  let view = (<></>);

  if (asideView == "queue") {
    view = (
      <>
        <div className={styles.header}>
          <div className={styles.iconbg}>
            <IconArticleFilled className={styles.icon} size={16} />
          </div>
          <strong className={styles.label}>Queue</strong>
        </div>
        <SakuraQueue />
      </>
    )
  } else if (asideView == "lyrics") {
    view = (
      <>
        <div className={styles.header}>
          <div className={styles.iconbg}>
            <IconMicrophone2 className={styles.icon} size={16} />
          </div>
          <strong className={styles.label}>Lyrics</strong>
        </div>
        <p className="subtle">not implemented</p>
      </>
    )
  }

  return (
    <div className={`${styles.aside} ${!showAsideView ? styles.hide : ''}`}>
      {view}
    </div>
  )
}
