"use client";

import { useSettings } from '@/app/api/settings';
import styles from "./aside.module.css";
import { SakuraQueue } from '../player/queue';

export function SakuraAside() {
  const asideView = useSettings(s => s.asideView);

  let view = (<></>);

  if (asideView == "queue") {
    view = (
      <>
        <h3>Queue</h3>
        <SakuraQueue />
      </>
    )
  } else if (asideView == "lyrics") {
    view = (
      <>
        <h3>Lyrics</h3>
        <p className="subtle">not implemented</p>
      </>
    )
  }

  return (
    <div className={styles.aside}>
      {view}
    </div>
  )
}