"use client";

import { usePlayer } from '@/app/api/player';
import styles from "./player.module.css";
import { song } from '@/app/types/song';
import { SakuraButton } from '../button/button';
import { PlayerPause, PlayerPlay } from 'tabler-icons-react';
import Link from 'next/link';
import { SakuraImage } from '../image/image';
import { Slider } from 'radix-ui';

export function Player() {
  const currentSong: song = usePlayer(s => s.currentSong) || {
    art: null,
    name: '...',
    artists: [
      {
        id: '',
        name: '...'
      }
    ]
  };
  const nowPlaying = usePlayer(s => s.nowPlaying);
  const currentTime = usePlayer(s => s.currentTime);
  const duration = usePlayer(s => s.duration);

  const pause = usePlayer(s => s.pause);
  const resume = usePlayer(s => s.resume);
  const seek = usePlayer(s => s.seek);

  const volume = usePlayer(s => s.volume);
  const setVolume = usePlayer(s => s.setVolume);

  return (
    <div className={styles.player}>
      <div className={styles.song}>
        <SakuraImage url={currentSong.art} identify={styles.art} />
        <div className={styles.songInfo}>
          <strong className={styles.name}><Link href={`/album/${currentSong.albumId}`}>{currentSong.name}</Link></strong>
          <span className={styles.artists}>{currentSong.artists.map(artist => <Link href={`/artist/${artist.id}`} className={styles.artist} key={artist.id}>{artist.name}</Link>)}</span>
        </div>
      </div>
      <div className={styles.middle}>
        <div className={styles.top}>
          <SakuraButton elem="button" identify={`${styles.action} ${styles.play}`} onClick={() => {
            if (nowPlaying) {
              pause();
            } else {
              resume();
            }
          }}>
            {nowPlaying ? <PlayerPause size={16} /> : <PlayerPlay size={16} />}
          </SakuraButton>
        </div>
      </div>
      <div className={styles.right}>
        <Slider.Root className={styles.volumeRoot} defaultValue={[volume]} min={0} max={1} step={0.01} onValueChange={value => setVolume(value[0])}>
          <Slider.Track className={styles.volumeTrack}>
            <Slider.Range className={styles.volumeRange} />
          </Slider.Track>
          <Slider.Thumb className={styles.volumeThumb} />
        </Slider.Root>
      </div>
    </div>
  )
}