"use client";

import styles from "./album.module.css";
import { SakuraImage } from '../image/image';
import Link from 'next/link';
import { album } from '@/app/types/album';
import React, { useEffect, useRef, useState } from 'react';
import { releaseType } from '@/app/tools/type';
import { DateTime } from "luxon";
import { useSession } from '@/app/session';
import { usePlayer } from '@/app/api/player';
import { usePathname } from 'next/navigation';
import { song } from '@/app/types/song';
import { IconCalendar, IconCalendarWeekFilled, IconDisc, IconHeadphonesFilled, IconHeartFilled, IconMusic, IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import { META_ICON_SIZE, SakuraMeta, SakuraMetaList } from '../meta/meta';
import { FastAverageColor } from 'fast-average-color';
import { convertColour } from '@/app/tools/colour';

const fac = new FastAverageColor();

interface SakuraAlbumProps {
  album: album,
  showArtist?: boolean,
  index?: number
}

export function SakuraAlbum({
  album,
  showArtist = false,
  index = 0
}: SakuraAlbumProps) {
  const artworkRef = useRef<HTMLDivElement>(null);
  const [ colour, setColour ] = useState<{ h: number, s: number, l: number } | null>(null);

  const ref = useRef<HTMLAnchorElement>(null);
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    if (!album.art || !visible) return;

    let cancelled = false;

    const run = async () => {
      const image = new Image();

      image.crossOrigin = "anonymous";
      image.src = album.art;

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
  }, [ album, visible ]);

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
    <Link href={`/album/${album.id}`} className={`${styles.album} ${visible && styles.visible}`} ref={ref} style={{'--delay': index * 0.02 + 's'} as React.CSSProperties}>
      <SakuraImage url={visible ? album.art : undefined} type="album" identify={`${styles.art} colourful`} ref={artworkRef} />
      <div className={styles.info}>
        {(album.type || album.played || album.starred) && (
          <SakuraMetaList>
            {album.starred && (
              <SakuraMeta name="Loved">
                <IconHeartFilled className={styles.loved} size={META_ICON_SIZE} />
              </SakuraMeta>
            )}
            {album.type && (
              <SakuraMeta name="Release type">
                {releaseType(album.type)}
              </SakuraMeta>
            )}
            {album.played && (
              <SakuraMeta name="Last listened">
                <IconHeadphonesFilled size={META_ICON_SIZE} />
                {DateTime.fromISO(album.played).toRelative({ style: "short" })}
              </SakuraMeta>
            )}
          </SakuraMetaList>
        )}
        <strong className={styles.name}>{album.name}</strong>
        {showArtist && <span className={styles.artists}>{album.artists.map((artist, i) => <span className={styles.artist} key={i}><span className={styles.artistName}>{artist.name}</span>{i != album.artists.length - 1 && <p>,</p>}</span>)}</span>}
        <SakuraMetaList>
          <SakuraMeta name="Release date">
            <IconCalendarWeekFilled size={META_ICON_SIZE} />
            {album.year || "????"}
          </SakuraMeta>
          <SakuraMeta name="Song count">
            <IconMusic size={META_ICON_SIZE} />
            {album.songs} song{album.songs > 1 && "s"}
          </SakuraMeta>
        </SakuraMetaList>
      </div>
    </Link>
  )
}

interface SakuraAlbumListProps {
  single?: boolean,
  children: React.ReactNode
}

export function SakuraAlbumList({
  single = false,
  children
}: SakuraAlbumListProps) {
  return (
    <div className={`${styles.list} ${single ? styles.single : ''}`}>
      {children}
    </div>
  )
}

export function SakuraAlbumSide({ album, showArtist = false }: { album: album, showArtist?: boolean }) {
  const { session } = useSession();

  const currentSong: song = usePlayer(s => s.currentSong);
  const nowPlaying: boolean = usePlayer(s => s.nowPlaying);
  const path = usePathname();

  return (
    <Link href={`/album/${album.id}`} className={`${styles.albumSide} ${path.startsWith(`/album/${album.id}`) && styles.primary}`}>
      <SakuraImage url={album.art} type="album" identify={styles.art} />
      <div className={styles.info}>
        <strong className={styles.name}>{album.name}</strong>
        {album.type && <p className={styles.meta}>{releaseType(album.type)}</p>}
        {album.played && <p className={styles.meta}>{DateTime.fromISO(album.played).toRelative()}</p>}
      </div>
      {(currentSong.albumId == album.id) ? (nowPlaying) ? <IconPlayerPauseFilled size={16} className={`${styles.activeIndicator} ${styles.activeIndicatorPlaying}`} /> : <IconPlayerPlayFilled size={16} className={styles.activeIndicator} /> : <></>}
    </Link>
  )
}

export function SakuraAlbumListSide({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.listSide}>
      {children}
    </div>
  )
}
