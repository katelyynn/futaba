import styles from "./album.module.css";
import { SakuraImage } from '../image/image.tsx';
import type { album } from '@/types/album.ts';
import React, { useEffect, useRef, useState } from 'react';
import { releaseType } from '@/tools/type.ts';
import { DateTime } from "luxon";
import { useSession } from '@/session.tsx';
import { usePlayer } from '@/api/player.ts';
import { Link, useLocation } from 'react-router-dom';
import type { song } from '@/types/song.ts';
import { IconCalendarWeekFilled, IconChevronLeft, IconChevronRight, IconHeadphonesFilled, IconHeartFilled, IconMusic, IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import { META_ICON_SIZE, SakuraMeta, SakuraMetaList } from '@/components/meta/meta.tsx';
import { FastAverageColor } from 'fast-average-color';
import { convertColour } from '@/tools/colour.ts';
import { SakuraButton } from "@/components/button/button.tsx";
import { SakuraTooltip } from "@/components/tooltip/tooltip.tsx";

interface SakuraAlbumProps {
  album: album,
  showArtist?: boolean,
  index?: number,
  sort?: string
}

export function SakuraAlbum({
  album,
  showArtist = false,
  index = 0,
  sort
}: SakuraAlbumProps) {
  const artworkRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [ colour, setColour ] = useState<{ h: number, s: number, l: number } | null>(null);

  const ref = useRef<HTMLAnchorElement>(null);
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    if (!album.art || !visible) return;

    let cancelled = false;

    const run = async () => {
      try {
        const fac = new FastAverageColor();

        const image = artworkRef.current?.querySelector('img');
        if (!image) return;

        const values = await fac.getColorAsync(image, {
          crossOrigin: 'anonymous'
        });

        if (cancelled) return;

        const { h, s, l } = convertColour(values.value);

        setColour({h, s, l});
      } catch (e) {
        console.error(e);
      }
    }

    run();

    return () => {
      cancelled = true;
    }
  }, [ album, visible ]);

  useEffect(() => {
    if (!colour || !artworkRef.current || !visible) return;

    apply(artworkRef);
    apply(nameRef);

    function apply(ref: React.RefObject<HTMLDivElement | null>) {
      if (!ref.current) return;

      ref.current.style.setProperty(`--hue-over`, colour!.h.toString());
      ref.current.style.setProperty(`--sat-over`, colour!.s.toString());
      ref.current.style.setProperty(`--lit-over`, colour!.l.toString());
    }
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
    <Link to={`/album/${album.id}`} className={`${styles.album} ${visible && styles.visible}`} ref={ref} style={{'--delay': index * 0.02 + 's'} as React.CSSProperties}>
      <SakuraImage url={album.art} type="album" identify={`${styles.art} colourful`} ref={artworkRef} />
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
        <strong className={`${styles.name} colourful`} ref={nameRef}>{album.name}</strong>
        {showArtist && <span className={styles.artists}>{album.artists.map((artist, i) => <span className={styles.artist} key={i}><span className={styles.artistName}>{artist.name}</span>{i != album.artists.length - 1 && <span className={styles.comma}>,</span>}</span>)}</span>}
        <SakuraMetaList>
          <SakuraMeta name="Release date">
            <IconCalendarWeekFilled size={META_ICON_SIZE} />
            {(sort == 'recently_added' || sort == 'importedAt') && album.imported ? DateTime.fromISO(album.imported).toRelative() : album.date ? DateTime.fromISO(album.date).toLocaleString(DateTime.DATE_MED) : album.year || "????"}
          </SakuraMeta>
          {!album.date ? (
            <SakuraMeta name="Song count">
              <IconMusic size={META_ICON_SIZE} />
              {album.songs} song{album.songs > 1 && "s"}
            </SakuraMeta>
          ) : ''}
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
  if (single) {
    return (
      <SakuraAlbumListScroller>
        <div className={`${styles.list} ${styles.single}`}>
          {children}
        </div>
      </SakuraAlbumListScroller>
    )
  }

  return (
    <div className={`${styles.list}`}>
      {children}
    </div>
  )
}

export function SakuraAlbumListScroller({
  children
}: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;

    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft < max);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    update();

    el.addEventListener('scroll', update, { passive: true });

    const resize = new ResizeObserver(() => update());
    resize.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      resize.disconnect();
    };
  }, []);

  return (
    <div className={`${styles.scrollerOverlay} ${canLeft ? styles.leftOverlay : ''} ${canRight ? styles.rightOverlay : ''}`}>
      <div className={styles.scroller} ref={ref}>
        {children}
      </div>
      <SakuraTooltip content="Left">
        <SakuraButton identify={`${styles.scrollerButton} ${styles.scrollerButtonLeft}`} disabled={!canLeft} elem="button" onClick={() => {
          const el = ref.current;
          if (!el) return;

          el.scrollBy({
            left: -1000,
            top: 0,
            behavior: "smooth"
          });
        }}>
          <IconChevronLeft className={styles.scrollerIcon} />
          Left
        </SakuraButton>
      </SakuraTooltip>
      <SakuraTooltip content="Right">
        <SakuraButton identify={`${styles.scrollerButton} ${styles.scrollerButtonRight}`} disabled={!canRight} elem="button" onClick={() => {
          const el = ref.current;
          if (!el) return;

          el.scrollBy({
            left: 1000,
            top: 0,
            behavior: "smooth"
          });
        }}>
          <IconChevronRight className={styles.scrollerIcon} />
          Right
        </SakuraButton>
      </SakuraTooltip>
    </div>
  )
}

export function SakuraAlbumSide({ album, showArtist = false }: { album: album, showArtist?: boolean }) {
  const currentSong: song | null = usePlayer(s => s.currentSong);
  const nowPlaying: boolean = usePlayer(s => s.nowPlaying);
  const path = useLocation().pathname;

  return (
    <Link to={`/album/${album.id}`} className={`${styles.albumSide} ${path.startsWith(`/album/${album.id}`) && styles.primary}`}>
      <SakuraImage url={album.art} type="album" identify={styles.art} />
      <div className={styles.info}>
        <strong className={styles.name}>{album.name}</strong>
        {album.type && <p className={styles.meta}>{releaseType(album.type)}</p>}
        {album.played && <p className={styles.meta}>{DateTime.fromISO(album.played).toRelative()}</p>}
      </div>
      {(currentSong && currentSong.albumId == album.id) ? (nowPlaying) ? <IconPlayerPauseFilled size={16} className={`${styles.activeIndicator} ${styles.activeIndicatorPlaying}`} /> : <IconPlayerPlayFilled size={16} className={styles.activeIndicator} /> : <></>}
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
