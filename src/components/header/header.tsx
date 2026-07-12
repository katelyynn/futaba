import styles from "./header.module.css";
import { SakuraImage } from '@/components/image/image.tsx';
import { Link } from 'react-router-dom';
import { releaseType } from '@/tools/type.ts';
import { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { convertColour } from "@/tools/colour.ts";

interface SakuraBackgroundProps {
  art: string
}

export function SakuraBackground({
  art
}: SakuraBackgroundProps) {
  const low = `${art}&size=500`;
  const high = `${art}&size=2000`;

  const [ bg, setBg ] = useState(low);

  useEffect(() => {
    setBg(low);

    const image = new Image();

    image.onload = () => {
      setBg(high);
    };

    image.src = high;
  }, [ art ]);

  return (
    <div className={styles.background} style={{ backgroundImage: `url(${bg})` }} />
  )
}

interface SakuraHeaderProps {
  art: string,
  name: string,
  artists?: { id: string, name: string, missing: boolean }[],
  type: 'artist' | 'album' | 'playlist'
}

export function SakuraHeader({
  art,
  name,
  artists,
  type
}: SakuraHeaderProps) {
  let text = 'Artist';
  if (type == 'album') {
    text = releaseType(type);
  } else if (type == 'playlist') {
    text = "Playlist";
  }

  const artworkRef = useRef<HTMLDivElement>(null);
  const [ colour, setColour ] = useState<{ h: number, s: number, l: number } | null>(null);

  useEffect(() => {
    if (!art) return;

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

        apply(artworkRef, h, s, l);
      } catch (e) {
        console.error(e);
      }
    }

    run();

    return () => {
      cancelled = true;
    }
  }, []);

  function apply(ref: React.RefObject<HTMLDivElement | null>, h: number, s: number, l: number) {
    if (!ref.current) return;

    ref.current.style.setProperty(`--hue-over`, h.toString());
    ref.current.style.setProperty(`--sat-over`, s.toString());
    ref.current.style.setProperty(`--lit-over`, l.toString());
  }

  return (
    <>
      <header className={styles.header}>
        <SakuraImage url={art} type={type} identify={`${styles.art} colourful`} expand ref={artworkRef} />
        <div className={styles.info}>
          <p className={styles.type}>{text}</p>
          <h1 className={styles.name}>{name}</h1>
          {artists && <h2 className={styles.artists}>{artists.map((artist, i) => <span className={styles.artist} key={i}><Link to={`/artist/${artist.id}`}>{artist.name}</Link>{i != artists.length - 1 && <p>,</p>}</span>)}</h2>}
        </div>
      </header>
    </>
  )
}
