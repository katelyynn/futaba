import styles from "./queue.module.css";

import { usePlayer } from '@/api/player.ts';
import { SakuraSongList } from '@/components/song/song.tsx';
import type { song } from '@/types/song.ts';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableSong } from '@/components/song/sortable_song.tsx';

export function SakuraQueue() {
  const queue: song[] = usePlayer(s => s.queue);

  const { setNodeRef } = useDroppable({
    id: "queue",
    data: { container: "queue" }
  });

  return (
    <div className={styles.queue} ref={setNodeRef}>
      <SortableContext items={queue.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <SakuraSongList>
          {queue.map((song, i) => <SortableSong song={song} key={i} index={i} container="queue" showArt />)}
        </SakuraSongList>
      </SortableContext>
    </div>
  )
}
