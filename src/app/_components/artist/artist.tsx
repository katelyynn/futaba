import { artist, ArtistListV2 } from '@/app/types/artist';
import styles from "./artist.module.css";
import { SakuraImage } from '../image/image';
import Link from 'next/link';
import { META_ICON_SIZE, SakuraMeta, SakuraMetaList } from '../meta/meta';
import { DateTime } from 'luxon';
import { IconDiscFilled, IconHeadphonesFilled, IconMusic } from '@tabler/icons-react';

interface SakuraArtistProps {
  artist: ArtistListV2,
  index?: number
}

export function SakuraArtist({
  artist,
  index = 0
}: SakuraArtistProps) {
  return (
    <Link href={`/artist/${artist.id}`} className={styles.artist} style={{'--delay': index * 0.02 + 's'} as React.CSSProperties}>
      <SakuraImage url={artist.art} type="artist" identify={styles.art} />
      <div className={styles.info}>
        {(artist.played) && (
          <SakuraMetaList>
            <SakuraMeta name="Release type">
              Artist
            </SakuraMeta>
            {artist.played && (
              <SakuraMeta name="Last listened">
                <IconHeadphonesFilled size={META_ICON_SIZE} />
                {DateTime.fromISO(artist.played).toRelative({ style: "short" })}
              </SakuraMeta>
            )}
          </SakuraMetaList>
        )}
        <strong className={styles.name}>{artist.name}</strong>
        <SakuraMetaList>
          <SakuraMeta name="Album count">
            <IconDiscFilled size={META_ICON_SIZE} />
            {artist.albums} album{artist.albums > 1 && "s"}
          </SakuraMeta>
          <SakuraMeta name="Song count">
            <IconMusic size={META_ICON_SIZE} />
            {artist.songs} song{artist.songs > 1 && "s"}
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
