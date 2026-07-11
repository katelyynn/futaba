"use client";

import styles from "./playlist.module.css";
import { SakuraImage } from '../image/image';
import Link from 'react-router-dom';
import { playlist } from '@/types/playlist';
import React, { useEffect, useRef, useState } from 'react';
import { releaseType } from '@/tools/type';
import { DateTime } from "luxon";
import { useSession } from '@/session';
import { usePlayer } from '@/api/player';
import { usePathname } from 'next/navigation';
import { song } from '@/types/song';
import { IconCalendar, IconCalendarWeekFilled, IconDisc, IconHeadphonesFilled, IconHeartFilled, IconMusic, IconPencilFilled, IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import { META_ICON_SIZE, SakuraMeta, SakuraMetaList } from '../meta/meta';
import { FastAverageColor } from 'fast-average-color';
import { convertColour } from '@/tools/colour';

const fac = new FastAverageColor();

export function SakuraPlaylist({ playlist }: { playlist: playlist }) {
  const artworkRef = useRef<HTMLDivElement>(null);
  const [ colour, setColour ] = useState<{ h: number, s: number, l: number } | null>(null);

  const ref = useRef<HTMLAnchorElement>(null);
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    if (!playlist.art || !visible) return;

    let cancelled = false;

    const run = async () => {
      const image = new Image();

      image.crossOrigin = "anonymous";
      image.src = playlist.art;

      await image.decode();
      if (cancelled) return;

      const values = fac.getColor(image);
      if (cancelled) return;

      const { h, s, l } = convertColour(values.value);

      setColour({h, s, l});
    }

    run();

    return () => {
      cancelled = true;
    }
  }, [ playlist, visible ]);

  useEffect(() => {
    if (!colour || !artworkRef.current || !visible) return;

    artworkRef.current.style.setProperty(`--hue-over`, colour.h.toString());
    artworkRef.current.style.setProperty(`--sat-over`, colour.s.toString());
    artworkRef.current.style.setProperty(`--lit-over`, colour.l.toString());
  }, [ colour, visible ]);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "200px" });

    observer.observe(elem);

    return () => observer.disconnect();
  }, []);

  return (
    <Link to={`/playlist/${playlist.id}`} className={`${styles.playlist} ${visible && styles.visible}`} ref={ref}>
      <SakuraImage url={visible ? playlist.art : undefined} type="playlist" identify={`${styles.art} colourful`} ref={artworkRef} />
      <div className={styles.info}>
        {(playlist.changed) && (
          <SakuraMetaList>
            {playlist.changed && (
              <SakuraMeta name="Last listened">
                <IconPencilFilled size={META_ICON_SIZE} />
                {DateTime.fromISO(playlist.changed).toRelative({ style: "short" })}
              </SakuraMeta>
            )}
          </SakuraMetaList>
        )}
        <strong className={styles.name}>{playlist.name}</strong>
        <SakuraMetaList>
          <SakuraMeta name="Song count">
            <IconMusic size={META_ICON_SIZE} />
            {playlist.songs} song{playlist.songs > 1 && "s"}
          </SakuraMeta>
        </SakuraMetaList>
      </div>
    </Link>
  )
}

export function SakuraPlaylistList({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.list}>
      {children}
    </div>
  )
}

export function SakuraPlaylistSide({ playlist }: { playlist: playlist }) {
  const path = usePathname();

  return (
    <Link to={`/playlist/${playlist.id}`} className={`${styles.playlistSide} ${path.startsWith(`/playlist/${playlist.id}`) && styles.primary}`}>
      <SakuraImage url={playlist.art} type="playlist" identify={styles.art} />
      <div className={styles.info}>
        <strong className={styles.name}>{playlist.name}</strong>
        {playlist.changed && <p className={styles.meta}>{DateTime.fromISO(playlist.changed).toRelative()}</p>}
      </div>
    </Link>
  )
}

export function SakuraPlaylistListSide({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.listSide}>
      {children}
    </div>
  )
}
