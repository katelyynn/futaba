import styles from "./album.module.css";
import { SakuraImage } from '../image/image';
import Link from 'next/link';
import { album } from '@/app/types/album';
import React from 'react';
import { releaseType } from '@/app/tools/type';
import { DateTime } from "luxon";
import { useSession } from '@/app/session';
import { usePlayer } from '@/app/api/player';
import { usePathname } from 'next/navigation';
import { song } from '@/app/types/song';
import { IconCalendar, IconCalendarWeekFilled, IconDisc, IconHeadphonesFilled, IconHeartFilled, IconMusic, IconPlayerPauseFilled, IconPlayerPlayFilled } from '@tabler/icons-react';
import { META_ICON_SIZE, SakuraMeta, SakuraMetaList } from '../meta/meta';

export function SakuraAlbum({ album, showArtist = false }: { album: album, showArtist?: boolean }) {
  return (
    <Link href={`/album/${album.id}`} className={styles.album}>
      <SakuraImage url={album.art} type="album" identify={styles.art} />
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

export function SakuraAlbumList({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.list}>
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