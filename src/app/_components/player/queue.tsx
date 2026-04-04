"use client";

import styles from "./queue.module.css";

import { usePlayer } from '@/app/api/player';
import { SakuraSong, SakuraSongList } from '../song/song';
import { song } from '@/app/types/song';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableSong } from '../song/sortable_song';

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