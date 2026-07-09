import { artist, ArtistListV2 } from '@/app/types/artist';
import styles from "./artist.module.css";
import { SakuraImage } from '../image/image';
import Link from 'next/link';
import { META_ICON_SIZE, SakuraMeta, SakuraMetaList } from '../meta/meta';
import { DateTime } from 'luxon';
import { IconDiscFilled, IconHeadphonesFilled } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { convertColour } from '@/app/tools/colour';
import { FastAverageColor } from 'fast-average-color';

interface SakuraArtistProps {
  artist: ArtistListV2,
  index?: number
}

export function SakuraArtist({
  artist,
  index = 0
}: SakuraArtistProps) {
  const artworkRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [ colour, setColour ] = useState<{ h: number, s: number, l: number } | null>(null);

  const ref = useRef<HTMLAnchorElement>(null);
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    if (!artist.art || !visible) return;

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
  }, [ artist, visible ]);

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
    <Link href={`/artist/${artist.id}`} className={styles.artist} ref={ref} style={{'--delay': index * 0.02 + 's'} as React.CSSProperties}>
      <SakuraImage url={artist.art} type="artist" identify={`${styles.art} colourful`} ref={artworkRef} />
      <div className={styles.info}>
        {(artist.played) && (
          <SakuraMetaList>
            {artist.played && (
              <SakuraMeta name="Last listened">
                <IconHeadphonesFilled size={META_ICON_SIZE} />
                {DateTime.fromISO(artist.played).toRelative({ style: "short" })}
              </SakuraMeta>
            )}
          </SakuraMetaList>
        )}
        <strong className={`${styles.name} colourful`} ref={nameRef}>{artist.name}</strong>
        <SakuraMetaList>
          <SakuraMeta name="Album count">
            <IconDiscFilled size={META_ICON_SIZE} />
            {artist.albums} album{artist.albums > 1 && "s"}
          </SakuraMeta>
        </SakuraMetaList>
      </div>
    </Link>
  )
}

export function SakuraArtistList({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.list}>
      {children}
    </div>
  )
}
