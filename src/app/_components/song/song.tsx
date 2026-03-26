"use client";

import styles from "./song.module.css";
import Link from 'next/link';
import { song } from '@/app/types/song';
import React, { useEffect, useState } from 'react';
import { parseDuration } from '@/app/tools/duration';
import { usePlayer } from '@/app/api/player';
import { SakuraButton } from '../button/button';
import { IconDots, IconExplicit, IconMinus, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerRecordFilled, IconPlaylistAdd } from '@tabler/icons-react';
import { useSession } from '@/app/session';
import { useSettings } from '@/app/api/settings';
import { SakuraImage } from '../image/image';
import { SakuraMenu } from '../menu/menu';

export function SakuraSongList({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.list}>
      {children}
    </div>
  )
}

interface SakuraDiscProps {
  number: number,
  children: React.ReactNode
}

export function SakuraDisc({
  number,
  children
}: SakuraDiscProps) {
  return (
    <div className={styles.disc}>
      {number > 1 && <strong className={styles.discHeader}>Disc {number}</strong>}
      {children}
    </div>
  )
}

interface SakuraSongProps {
  song: song,
  inQueue?: boolean,
  showArt?: boolean,
  hideIndex?: boolean,
  queueIndex?: number
}

export function SakuraSong({
  song,
  inQueue = false,
  showArt = false,
  hideIndex = false,
  queueIndex
}: SakuraSongProps) {
  if (inQueue) hideIndex = true;

  const { session } = useSession();
  const toScrobble = useSettings(s => s.scrobble);
  const play = usePlayer(s => s.play);
  const queue = usePlayer(s => s.queue);
  const addToQueue = usePlayer(s => s.addToQueue);
  const removeFromQueue = usePlayer(s => s.removeFromQueue);
  const clearQueue = usePlayer(s => s.clearQueue);

  const nowPlaying = usePlayer(s => s.nowPlaying);
  const currentSong = usePlayer(s => s.currentSong);

  const isPlaying = currentSong?.id == song.id;

  const menu = (
    <>
      <SakuraButton elem="button" identifyOwn="menu" onClick={() => {
        const inQueue = queue.findIndex(s => s.id == song.id) > -1;
        if (!inQueue) clearQueue();

        play(song, session!, toScrobble);
      }}>
        <IconPlayerPlayFilled size={16} />
        Play
      </SakuraButton>
      {!inQueue ? (
        <SakuraButton elem="button" identifyOwn="menu" onClick={() => addToQueue([song])}>
          <IconPlaylistAdd size={16} />
          Add to queue
        </SakuraButton>
      ) : (
        <SakuraButton elem="button" identifyOwn="menu" onClick={() => removeFromQueue(queueIndex!)}>
          <IconMinus size={16} />
          Remove from queue
        </SakuraButton>
      )}
    </>
  );

  return (
    <div className={`${styles.song} ${isPlaying && styles.active}`} onDoubleClick={() => {
      const inQueue = queue.findIndex(s => s.id == song.id) > -1;
      if (!inQueue) clearQueue();

      play(song, session!, toScrobble);
    }}>
      {!hideIndex && <p className={`${styles.index} ${isPlaying && styles.activeIndex}`}>{!isPlaying ? song.index : nowPlaying ? <IconPlayerPauseFilled size={16} className={`${styles.activeIndicator} ${styles.activeIndicatorPlaying}`} /> : <IconPlayerPlayFilled size={16} className={styles.activeIndicator} />}</p>}
      {showArt && <SakuraImage url={song.art} identify={styles.art} />}
      <div className={styles.info}>
        <strong className={styles.name}>{song.name}</strong>
        <div className={styles.artists}>
          {song.explicit == "explicit" && <span className={styles.explicit}>E</span>}
          {song.artists.map((artist, i) => <span className={styles.artist} key={i}><Link href={`/artist/${artist.id}`}>{artist.name}</Link>{i != song.artists.length - 1 && <p>,</p>}</span>)}
        </div>
      </div>
      <div className={styles.actions}>
        <SakuraMenu content={menu}>
          <SakuraButton elem="button" identify={styles.action}>
            <IconDots size={16} />
          </SakuraButton>
        </SakuraMenu>
      </div>
      {!inQueue && <p className={styles.duration}>{parseDuration(song.duration)}</p>}
    </div>
  )
}