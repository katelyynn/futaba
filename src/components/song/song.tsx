import styles from "./song.module.css";
import { Link } from 'react-router-dom';
import type { song } from '@/types/song.ts';
import React from 'react';
import { parseDuration } from '@/tools/duration.ts';
import { usePlayer } from '@/api/player.ts';
import { SakuraButton } from '@/components/button/button.tsx';
import { IconCarambola, IconDisc, IconDots, IconHeart, IconHeartFilled, IconHourglass, IconHourglassFilled, IconMinus, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerStopFilled, IconPlaylistAdd, IconPlaylistX, IconZzz } from '@tabler/icons-react';
import { useSession } from '@/session.tsx';
import { useSettings } from '@/api/settings.ts';
import { SakuraImage } from '@/components/image/image.tsx';
import { MENU_ICON_HEAD_SIZE, SakuraContextMenu, SakuraMenu, SakuraMenuDivider, SakuraMenuHeader } from '@/components/menu/menu.tsx';
import { SakuraTooltip } from '@/components/tooltip/tooltip.tsx';
import { setLove } from '@/api/love.ts';
import { SakuraArtists } from "@/components/artists/artists.tsx";

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
  songsList?: song[],
  queueIndex?: number
}

export function SakuraSong({
  song,
  inQueue = false,
  showArt = false,
  hideIndex = false,
  songsList,
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

  const lovedMap = usePlayer(s => s.loved);
  const setLoved = usePlayer(s => s.setLoved);

  const loved = lovedMap[song.id] ?? !!song.starred;

  function playSong() {
    if (songsList) {
      clearQueue();
      addToQueue(songsList, null, false);
    } else {
      const inQueue = queue.findIndex(s => s.id == song.id) > -1;
      if (!inQueue) clearQueue();
    }

    play(song, session!);
  }

  async function loveSong() {
    const currentState = loved;
    const newState = !currentState;

    try {
      await setLove(session!, song.id, currentState, "song");

      setLoved(song.id, newState);
    } catch {
      setLoved(song.id, currentState);
    }
  }

  const menu = (
    <>
      <SakuraMenuHeader>
        <SakuraTooltip content="Play song">
          <SakuraButton elem="button" identifyOwn="menuHead" onClick={() => {
            const inQueue = queue.findIndex(s => s.id == song.id) > -1;
            if (!inQueue) clearQueue();
            play(song, session!);
          }}>
            <IconPlayerPlayFilled size={MENU_ICON_HEAD_SIZE} />
            Play song
          </SakuraButton>
        </SakuraTooltip>
        {!inQueue ? (
          <SakuraTooltip content="Add song to queue">
            <SakuraButton elem="button" identifyOwn="menuHead" onClick={() => addToQueue([song])}>
              <IconPlaylistAdd size={MENU_ICON_HEAD_SIZE} />
              Add song to queue
            </SakuraButton>
          </SakuraTooltip>
        ) : (
          <SakuraTooltip content="Remove song from queue">
            <SakuraButton elem="button" identifyOwn="menuHead" onClick={() => removeFromQueue(queueIndex!)}>
              <IconPlaylistX size={MENU_ICON_HEAD_SIZE} />
              Remove song from queue
            </SakuraButton>
          </SakuraTooltip>
        )}
        <SakuraTooltip content={loved ? "You love this song" : "Love this song"}>
          <SakuraButton primary={loved} elem="button" identifyOwn="menuHead" onClick={() => loveSong()}>
            {loved ? <IconHeartFilled size={MENU_ICON_HEAD_SIZE} /> : <IconHeart size={MENU_ICON_HEAD_SIZE} />}
            {loved ? "You love this song" : "Love this song"}
          </SakuraButton>
        </SakuraTooltip>
      </SakuraMenuHeader>
      {inQueue ? (
        <>
          <SakuraButton elem="button" onClick={() => alert("not implemented")} identifyOwn="menu">
            <IconPlayerStopFilled size={14} />
            End queue after
          </SakuraButton>
          <SakuraButton elem="button" onClick={() => alert("not implemented")} identifyOwn="menu">
            <IconZzz size={14} />
            Sleep timer
          </SakuraButton>
          <SakuraMenuDivider />
        </>
      ) : ''}
      <SakuraButton elem="link" href={`/album/${song.albumId}`} identifyOwn="menu">
        <IconDisc size={14} />
        Go to album
      </SakuraButton>
      <SakuraButton elem="link" href={`/artist/${song.artistId}`} identifyOwn="menu">
        <IconCarambola size={14} />
        Go to artist
      </SakuraButton>
    </>
  );

  return (
    <SakuraContextMenu content={menu}>
      <div className={`${styles.song} ${isPlaying && styles.active}`} onDoubleClick={() => playSong()}>
        {!hideIndex && <p className={`${styles.index} ${isPlaying && styles.activeIndex}`}>{!isPlaying ? song.index : nowPlaying ? <IconPlayerPauseFilled size={16} className={`${styles.activeIndicator} ${styles.activeIndicatorPlaying}`} /> : <IconPlayerPlayFilled size={16} className={styles.activeIndicator} />}</p>}
        {showArt && <SakuraImage url={song.art} identify={styles.art} />}
        <div className={styles.info}>
          <strong className={styles.name}>
            {song.name}
            <SakuraComment text={song.comment} />
          </strong>
          <div className={styles.artists}>
            {song.explicit && <span className={styles.explicit}>E</span>}
            <SakuraArtists artists={song.artists} />
          </div>
        </div>
        {song.album ? (
          <div className={styles.info2}>
            <Link to={`/album/${song.albumId}`} className={styles.album}>
              {song.album}
            </Link>
          </div>
        ) : ''}
        {(!inQueue && song.plays) && (
          <SakuraTooltip content="Play count">
            <div className={styles.plays}>
              <IconPlayerPlayFilled size={14} />
              <span className={styles.playCount}>{song.plays.toLocaleString()}</span>
            </div>
          </SakuraTooltip>
        )}
        <div className={styles.actions}>
          <SakuraMenu content={menu}>
            <SakuraButton elem="button" identify={`${styles.action} ${styles.menuButton}`}>
              <IconDots size={16} />
            </SakuraButton>
          </SakuraMenu>
          <SakuraTooltip content={loved ? "Loved" : "Love"}>
            <SakuraButton elem="button" identify={`${styles.action} ${loved && styles.dontHide}`} onClick={() => loveSong()}>
              {loved ? <IconHeartFilled className={styles.loved} size={16} /> : <IconHeart size={16} />}
            </SakuraButton>
          </SakuraTooltip>
        </div>
        {!inQueue && <p className={styles.duration}>{parseDuration(song.duration)}</p>}
      </div>
    </SakuraContextMenu>
  )
}

export function SakuraComment({
  text
}: { text?: string }) {
  if (!text) return <></>;

  return (
    <label className={styles.comment}>
      {text}
    </label>
  )
}
