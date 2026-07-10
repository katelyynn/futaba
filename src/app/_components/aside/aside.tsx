"use client";

import { useSettings } from '@/app/api/settings';
import styles from "./aside.module.css";
import { SakuraQueue } from '../player/queue';
import { SakuraSerif } from '../serif/serif';

export function SakuraAside() {
  const asideView = useSettings(s => s.asideView);
  const showAsideView = useSettings(s => s.showAsideView);

  let view = (<></>);

  if (asideView == "queue") {
    view = (
      <>
        <SakuraSerif>Queue</SakuraSerif>
        <SakuraQueue />
      </>
    )
  } else if (asideView == "lyrics") {
    view = (
      <>
        <SakuraSerif>Lyrics</SakuraSerif>
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
