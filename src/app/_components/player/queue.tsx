import styles from "./queue.module.css";

import { usePlayer } from '@/app/api/player';
import { SakuraSong, SakuraSongList } from '../song/song';
import { song } from '@/app/types/song';

export function SakuraQueue() {
  const queue: song[] = usePlayer(s => s.queue);

  return (
    <div className={styles.queue}>
      <SakuraSongList>
        {queue.map((song, i) => <SakuraSong song={song} key={i} inQueue showArt queueIndex={i} />)}
      </SakuraSongList>
    </div>
  )
}