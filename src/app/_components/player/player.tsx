"use client";

import { getAudio, usePlayer } from '@/app/api/player';
import styles from "./player.module.css";
import { song } from '@/app/types/song';
import { SakuraButton } from '../button/button';
import Link from 'next/link';
import { SakuraImage } from '../image/image';
import { Slider } from 'radix-ui';
import React, { useEffect } from 'react';
import { parseDuration } from '@/app/tools/duration';
import { IconArticleFilled, IconPlayerPauseFilled, IconPlayerPlayFilled, IconVolume, IconVolume3 } from '@tabler/icons-react';
import { useSettings } from '@/app/api/settings';
import { useSession } from '@/app/session';

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

  const volume = useSettings(s => s.volume);
  const setVolume = useSettings(s => s.setVolume);

  const [ volumeBeforeMuting, setVolumeBeforeMuting ] = React.useState(0.5);

  const { session } = useSession();
  const scrobble = useSettings(s => s.scrobble);

  const hydrate = usePlayer(s => s.hydrate);

  useEffect(() => {
    if (!session) return;
    hydrate(session, scrobble);
  }, [ hydrate, session, scrobble ]);

  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;

    audio.volume = volume;
  }, [ volume ]);

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
          <SakuraButton elem="button" identify={`${styles.action} ${styles.play} ${nowPlaying && styles.actionActive}`} onClick={() => {
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
        <SakuraButton elem="button" identify={`${styles.action}`}>
          <IconArticleFilled size={16} />
        </SakuraButton>
        <div className={styles.volume}>
          <SakuraButton elem="button" identify={`${styles.action} ${styles.volumeButton} ${volume > 0 && styles.actionActive}`} onClick={() => {
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