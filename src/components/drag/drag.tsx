import { usePlayer } from '@/api/player.ts';
import type { song } from '@/types/song.ts';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from "@dnd-kit/core";
import React, { useState } from 'react';
import { SakuraSong } from '@/components/song/song.tsx';

export function Draggable({
  children
}: { children: React.ReactNode }) {
  const [ activeSong, setActiveSong ] = useState<song | null>(null);

  const queue = usePlayer(s => s.queue);
  const reOrderQueue = usePlayer(s => s.reorderQueue);
  const addToQueue = usePlayer(s => s.addToQueue);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6
      }
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const from = active.data.current?.container;
    const to = over.data.current?.container;
    const draggedSong = active.data.current?.song;

    if (!draggedSong) return;

    const oldIndex = queue.findIndex(s => s.id == draggedSong.id);
    const overIndex = queue.findIndex(s => s.id == over.id);
    const newIndex = overIndex == -1 ? queue.length : overIndex;

    if (from == "queue" && to == "queue") {
      if (oldIndex != newIndex) reOrderQueue(oldIndex, newIndex);
      return;
    }

    if (from == "album" && to == "queue") {
      if (oldIndex != -1) {
        if (oldIndex != newIndex) reOrderQueue(oldIndex, newIndex);
      } else {
        addToQueue([ draggedSong ], newIndex);
      }

      return;
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={event => setActiveSong(event.active.data.current?.song)} onDragEnd={handleDragEnd} onDragCancel={() => setActiveSong(null)}>
      {children}
      <DragOverlay>
        {activeSong && (
          <SakuraSong song={activeSong} showArt inQueue />
        )}
      </DragOverlay>
    </DndContext>
  )
}
