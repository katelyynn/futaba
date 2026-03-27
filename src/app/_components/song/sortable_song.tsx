"use client";

import { song } from '@/app/types/song';
import { useSortable } from '@dnd-kit/sortable';
import { SakuraSong } from './song';
import { CSS } from '@dnd-kit/utilities';

export function SortableSong({
  song,
  index,
  container,
  songsList,
  showArt
}: {
  song: song,
  index?: number,
  container: string,
  songsList?: song[],
  showArt?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: song.id,
    data: {
      container,
      song
    },
    animateLayoutChanges: () => false
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SakuraSong song={song} inQueue={container == "queue"} queueIndex={index} songsList={songsList} showArt={showArt} />
    </div>
  )
}