"use client";

import { usePlayer } from '@/app/api/player';
import styles from "./player.module.css";
import { song } from '@/app/types/song';
import { SakuraButton } from '../button/button';
import Link from 'next/link';
import { SakuraImage } from '../image/image';
import { Slider } from 'radix-ui';
import React from 'react';
import { parseDuration } from '@/app/tools/duration';
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconVolume, IconVolume3 } from '@tabler/icons-react';

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

  const [ volumeBeforeMuting, setVolumeBeforeMuting ] = React.useState(0.5);

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
          <SakuraButton elem="button" primary={nowPlaying} identify={`${styles.action} ${styles.play}`} onClick={() => {
            if (nowPlaying) {
              pause();
            } else {
              resume();
            }
          }}>
            {nowPlaying ? <IconPlayerPauseFilled size={16} /> : <IconPlayerPlayFilled size={16} />}
          </SakuraButton>
        </div>
        <div className={styles.bottom}>
          <p className={styles.time}>{parseDuration(currentTime)}</p>
          <Slider.Root className={styles.playerRoot} value={[currentTime]} min={0} max={duration || 0} onValueChange={value => seek(value[0])}>
            <Slider.Track className={styles.playerTrack}>
              <Slider.Range className={styles.playerRange} />
            </Slider.Track>
            <Slider.Thumb className={styles.playerThumb} />
          </Slider.Root>
          <p className={styles.time}>{parseDuration(duration)}</p>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.volume}>
          <SakuraButton primary={volume == 0} elem="button" identify={`${styles.action} ${styles.volumeButton}`} onClick={() => {
            if (volume == 0) {
              setVolume(volumeBeforeMuting);
            } else {
              setVolumeBeforeMuting(volume);
              setVolume(0);
            }
          }}>
            {volume == 0 ? <IconVolume3 size={16} /> : <IconVolume size={16} />}
          </SakuraButton>
          <Slider.Root className={styles.volumeRoot} value={[volume]} min={0} max={1} step={0.01} onValueChange={value => setVolume(value[0])}>
            <Slider.Track className={styles.volumeTrack}>
              <Slider.Range className={styles.volumeRange} />
            </Slider.Track>
            <Slider.Thumb className={styles.volumeThumb} />
          </Slider.Root>
        </div>
      </div>
    </div>
  )
}