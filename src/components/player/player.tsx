import { MAX_VOLUME, usePlayer } from '@/api/player.ts';
import styles from "./player.module.css";
import type { song } from '@/types/song.ts';
import { SakuraButton } from '@/components/button/button.tsx';
import { Link } from 'react-router-dom';
import { SakuraImage } from '@/components/image/image.tsx';
import React, { useEffect } from 'react';
import { parseDuration } from '@/tools/duration.ts';
import { IconArrowsShuffle2, IconArticleFilled, IconHeart, IconHeartFilled, IconMaximize, IconMicrophone2, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerTrackNextFilled, IconPlayerTrackPrevFilled, IconRepeat, IconRepeatOff, IconRepeatOnce, IconVolume, IconVolume3 } from '@tabler/icons-react';
import { useSettings } from '@/api/settings.ts';
import { useSession } from '@/session.tsx';
import { SakuraTooltip } from '@/components/tooltip/tooltip.tsx';
import { SakuraSlider } from '@/components/slider/slider.tsx';
import { setLove } from '@/api/love.ts';
import type { session } from '@/api/client.ts';
import { SakuraArtists } from "@/components/artists/artists.tsx";

export function Player() {
  const currentSong: song = usePlayer(s => s.currentSong) || {
    art: '',
    id: '',
    name: '...',
    artists: [
      {
        id: '',
        name: '...'
      }
    ],
    duration: 0,
    created: '',
    bitDepth: 0,
    bitRate: 0,
    channelCount: 0,
    explicit: false,
    genres: [],
    index: -1,
    suffix: '',
    path: '',
    url: new URL('about:blank'),
    albumId: ''
  };
  const nowPlaying = usePlayer(s => s.nowPlaying);
  const currentTime = usePlayer(s => s.currentTime);
  const duration = usePlayer(s => s.duration);

  const pause = usePlayer(s => s.pause);
  const resume = usePlayer(s => s.resume);
  const seek = usePlayer(s => s.seek);

  const playPrev = usePlayer(s => s.playPrev);
  const playNext = usePlayer(s => s.playNext);

  const volume = useSettings(s => s.volume);
  const setVolume = useSettings(s => s.setVolume);
  const setPlayerVolume = usePlayer(s => s.setVolume);

  const [ volumeBeforeMuting, setVolumeBeforeMuting ] = React.useState(0.5);

  const { session } = useSession();
  const scrobble = useSettings(s => s.scrobble);
  const setToScrobble = usePlayer(s => s.setToScrobble);

  const hydrate = usePlayer(s => s.hydrate);

  const waveform = useSettings(s => s.waveform);

  const asideView = useSettings(s => s.asideView);
  const setAsideView = useSettings(s => s.setAsideView);

  const showAsideView = useSettings(s => s.showAsideView);
  const setShowAsideView = useSettings(s => s.setShowAsideView);

  const loop = useSettings(s => s.loop);
  const setLoop = useSettings(s => s.setLoop);
  const setPlayerLoop = usePlayer(s => s.setLoop);

  const shuffle = useSettings(s => s.shuffle);
  const setShuffle = useSettings(s => s.setShuffle);
  const setPlayerShuffle = usePlayer(s => s.setShuffle);

  const setFullscreen = useSettings(s => s.setFullscreen);

  useEffect(() => {
    if (!session) return;
    hydrate(session);
  }, [ hydrate, session ]);

  useEffect(() => {
    setToScrobble(scrobble);
  }, [ setToScrobble, scrobble ]);

  useEffect(() => {
    setPlayerVolume(volume);
  }, [ setPlayerVolume, volume ]);

  useEffect(() => {
    setPlayerLoop(loop);
  }, [ setPlayerLoop, loop ]);

  useEffect(() => {
    setPlayerShuffle(shuffle);
  }, [ setPlayerShuffle, shuffle ]);

  return (
    <div className={styles.player}>
      <PlaybackSongPreview session={session!} currentSong={currentSong} key={currentSong.id} />
      <div className={styles.middle}>
        <div className={styles.top}>
          <SakuraTooltip content={shuffle ? "Playing shuffled" : "Playing in order"}>
            <SakuraButton elem="button" identify={`${styles.action} ${shuffle && styles.actionActive}`} onClick={() => {
              setShuffle(!shuffle);
            }}>
              <IconArrowsShuffle2 size={16} />
            </SakuraButton>
          </SakuraTooltip>
          <SakuraTooltip content="Previous">
            <SakuraButton elem="button" identify={`${styles.action}`} onClick={() => {
              playPrev(session!, scrobble);
            }}>
              <IconPlayerTrackPrevFilled size={16} />
            </SakuraButton>
          </SakuraTooltip>
          <SakuraTooltip content="Play">
            <SakuraButton elem="button" identify={`${styles.action} ${styles.play} ${nowPlaying && styles.actionActive}`} onClick={() => {
              if (nowPlaying) {
                pause();
              } else {
                resume();
              }
            }}>
              {nowPlaying ? <IconPlayerPauseFilled size={16} /> : <IconPlayerPlayFilled size={16} />}
            </SakuraButton>
          </SakuraTooltip>
          <SakuraTooltip content="Next">
            <SakuraButton elem="button" identify={`${styles.action}`} onClick={() => {
              playNext(session!, scrobble);
            }}>
              <IconPlayerTrackNextFilled size={16} />
            </SakuraButton>
          </SakuraTooltip>
          <SakuraTooltip content={loop == "once" ? "Loop once" : loop == true ? "Loop queue" : "Do not loop"}>
            <SakuraButton elem="button" identify={`${styles.action} ${loop && styles.actionActive}`} onClick={() => {
              if (loop == true) {
                setLoop("once");
              } else if (loop == "once") {
                setLoop(false);
              } else {
                setLoop(true);
              }
            }}>
              {loop == "once" ? <IconRepeatOnce size={16} /> : <IconRepeat size={16} />}
            </SakuraButton>
          </SakuraTooltip>
        </div>
        <div className={styles.bottom}>
          <p className={styles.time}>{parseDuration(currentTime)}</p>
          <div className={styles.playerBar}>
            <SakuraSlider className={styles.playerRoot} value={currentTime} min={0} max={duration || 0} onChange={value => seek(value)} showTooltip={false} />
          </div>
          <p className={styles.time}>{parseDuration(duration)}</p>
        </div>
      </div>
      <div className={styles.right}>
        <SakuraTooltip content="Lyrics">
          <SakuraButton elem="button" identify={`${styles.action} ${(asideView == "lyrics" && showAsideView) && styles.actionActive}`} onClick={() => {
            if (showAsideView) {
              if (asideView == 'lyrics') {
                setShowAsideView(false);
                return;
              }
            } else {
              setShowAsideView(true);
            }

            setAsideView("lyrics");
          }}>
            <IconMicrophone2 size={16} />
          </SakuraButton>
        </SakuraTooltip>
        <SakuraTooltip content="Queue">
          <SakuraButton elem="button" identify={`${styles.action} ${(asideView == "queue" && showAsideView) && styles.actionActive}`} onClick={() => {
            if (showAsideView) {
              if (asideView == 'queue') {
                setShowAsideView(false);
                return;
              }
            } else {
              setShowAsideView(true);
            }

            setAsideView("queue");
          }}>
            <IconArticleFilled size={16} />
          </SakuraButton>
        </SakuraTooltip>
        <div className={styles.volume}>
          <SakuraTooltip content="Volume">
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
          </SakuraTooltip>
          <SakuraSlider className={styles.volumeRoot} value={volume} min={0} max={MAX_VOLUME} step={0.01} onChange={value => setVolume(value)} showTooltipAs="percent" />
        </div>
        <SakuraTooltip content="Fullscreen">
          <SakuraButton elem="button" identify={`${styles.action}`} onClick={() => {
            setFullscreen(true);
          }}>
            <IconMaximize size={16} />
          </SakuraButton>
        </SakuraTooltip>
      </div>
    </div>
  )
}

export function PlaybackSongPreview({
  session,
  currentSong
}: { session: session, currentSong: song }) {
  const lovedMap = usePlayer(s => s.loved);
  const setLoved = usePlayer(s => s.setLoved);

  const loved = lovedMap[currentSong.id] ?? !!currentSong.starred;

  return (
    <div className={styles.song}>
      <SakuraImage url={currentSong.art} identify={styles.art} />
      <div className={styles.songInfo}>
        <Link to={`/album/${currentSong.albumId}`} className={styles.name}>{currentSong.name}</Link>
        <span className={styles.artists}>
          {currentSong.explicit && <span className={styles.explicit}>E</span>}
          <SakuraArtists artists={currentSong.artists} />
        </span>
      </div>
      <div className={styles.songActions}>
        <SakuraTooltip content={loved ? "Loved" : "Love"}>
          <SakuraButton elem="button" identify={`${styles.action} ${loved && styles.dontHide}`} onClick={async () => {
            const currentState = loved;
            const newState = !currentState;

            try {
              await setLove(session!, currentSong.id, currentState, "song");

              setLoved(currentSong.id, newState);
            } catch {
              setLoved(currentSong.id, currentState);
            }
          }}>
            {loved ? <IconHeartFilled className={styles.loved} size={16} /> : <IconHeart size={16} />}
          </SakuraButton>
        </SakuraTooltip>
      </div>
    </div>
  )
}
