import { SakuraAlbum, SakuraAlbumList } from '@/components/album/album.tsx';
import { SakuraGroup, SakuraGroupList } from '@/components/group/group.tsx';
import { SakuraActions } from '@/components/header/actions.tsx';
import { SakuraBackground, SakuraHeader } from '@/components/header/header.tsx';
import { META_ICON_SIZE_BIG, SakuraMeta, SakuraMetaLabel, SakuraMetaList } from '@/components/meta/meta.tsx';
import { SakuraDisc, SakuraSongList } from '@/components/song/song.tsx';
import { SortableSong } from '@/components/song/sortable_song.tsx';
import { SakuraPage, SakuraSeparator, SakuraSplit } from '@/components/split/split.tsx';
import { ErrorHandler } from '@/errorHandler.tsx';
import { useAlbum, useAlbumV2 } from '@/hook/album.ts';
import { useArtistAlbumsV2 } from '@/hook/artist.ts';
import { useSession } from '@/session.tsx';
import { bytes } from '@/tools/size.ts';
import type { album_full } from '@/types/album.ts';
import { SortableContext } from '@dnd-kit/sortable';
import { IconCalendarWeekFilled, IconFolder, IconHeadphonesFilled, IconMusic, IconPlayerPlayFilled, IconProgressDown } from '@tabler/icons-react';
import { DateTime, Duration } from 'luxon';

import styles from './Album.module.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Album() {
  const [ loved, setLoved ] = useState(false);

  const { session } = useSession();
  const params = useParams();

  const id = params.id as string;

  const { data: dataV2, isLoading: isLoadingV2, error: errorV2 } = useAlbumV2(session, id);
  const { data, isLoading, error } = useAlbum(session, id);

  useEffect(() => {
    setLoved(dataV2?.starred || false)
  }, [ dataV2 ]);

  if (isLoadingV2 || isLoading) return <div>loading</div>;
  if (errorV2 || !dataV2) return <ErrorHandler error={errorV2 || 'unknown'} />;
  if (error || !data) return <ErrorHandler error={error || 'unknown'} />;

  console.log('album data V2', dataV2);
  console.log('album data', data);

  const duration = Duration.fromMillis(dataV2.duration * 1000).shiftTo('hours', 'minutes', 'seconds').toObject();

  if (duration.seconds) duration.seconds = Math.round(duration.seconds);

  const artist = dataV2.artistId || '';

  return (
    <>
      <SakuraBackground art={dataV2.art} />
      <SakuraPage split>
        <SakuraSplit side="left">
          <SakuraGroupList>
            <SakuraGroup name="Tracklist">
              {Object.entries((data as album_full).songs).map(([disc, songs]) => (
                <SakuraDisc number={Number(disc)} key={disc}>
                  <SortableContext items={songs.map(s => s.id)}>
                    <SakuraSongList>
                        {songs.map(song => (
                          <SortableSong song={song} key={song.id} container="album" songsList={(data as album_full).songsList} />
                        ))}
                    </SakuraSongList>
                  </SortableContext>
                </SakuraDisc>
              ))}
              {dataV2.label.length > 0 && (
                <label className={styles.license}>© {dataV2.label.join(',')}</label>
              )}
            </SakuraGroup>
            <SakuraGroup name="More from this artist">
              <OtherAlbumsByArtist />
            </SakuraGroup>
          </SakuraGroupList>
        </SakuraSplit>
        <SakuraSeparator orientation="vertical" />
        <SakuraSplit side="right">
          <SakuraHeader art={dataV2.art} name={dataV2.name} artists={dataV2.artists} type="album" albumType={dataV2.type} />
          <SakuraActions id={data.id} songs={data.songsList} count={data.songCount} type="album" loved={loved} setLoved={setLoved} />
          <SakuraMetaList space>
            <SakuraMeta name="Release date" small={false}>
              <IconCalendarWeekFilled size={META_ICON_SIZE_BIG} />
              <SakuraMetaLabel>Release date</SakuraMetaLabel>
              {dataV2.date ? DateTime.fromISO(dataV2.date).toLocaleString(DateTime.DATE_MED) : 'No date found'}
            </SakuraMeta>
            <SakuraMeta name="Import date" small={false}>
              <IconProgressDown size={META_ICON_SIZE_BIG} />
              <SakuraMetaLabel>Import date</SakuraMetaLabel>
              {DateTime.fromISO(dataV2.imported).toRelative({ style: 'short' })}
            </SakuraMeta>
            <SakuraMeta name="File size" small={false}>
              <IconFolder size={META_ICON_SIZE_BIG} />
              <SakuraMetaLabel>File size</SakuraMetaLabel>
              {bytes(dataV2.size)}
            </SakuraMeta>
          </SakuraMetaList>
          <SakuraMetaList space>
            <SakuraMeta name="Song count" small={false}>
              <IconMusic size={META_ICON_SIZE_BIG} />
              <SakuraMetaLabel>Song count</SakuraMetaLabel>
              {dataV2.songs} song{dataV2.songs > 1 && "s"}, {duration.hours ? `${duration.hours}h ` : ''}{duration.minutes}m {duration.seconds}s
            </SakuraMeta>
            {dataV2.played && dataV2.plays && (
              <>
                <SakuraMeta name="Total listens" small={false}>
                  <IconPlayerPlayFilled size={META_ICON_SIZE_BIG} />
                  <SakuraMetaLabel>Total listens</SakuraMetaLabel>
                  {dataV2.plays} play{dataV2.plays > 1 && "s"}
                </SakuraMeta>
                <SakuraMeta name="Last listened" small={false}>
                  <IconHeadphonesFilled size={META_ICON_SIZE_BIG} />
                  <SakuraMetaLabel>Last listened</SakuraMetaLabel>
                  {DateTime.fromISO(dataV2.played).toRelative({ style: 'short' })}
                </SakuraMeta>
              </>
            )}
          </SakuraMetaList>
          <h3>About</h3>
          <About />
        </SakuraSplit>
      </SakuraPage>
    </>
  )

  function About() {
    const comment = (data as album_full).songsList[0]?.comment;

    if (comment) {
      return (
        <div>
          {comment}
        </div>
      )
    }

    return (
      <div>
        <em>No comment</em>
      </div>
    )

    /*const { data, isLoading, error } = useAlbumInfo(session, id);

    if (isLoading) return <div>loading</div>;
    if (error) return <ErrorHandler error={error} />;

    console.log("info", data);

    return (
      <div>
        {data.notes}
      </div>
    )*/
  }

  function OtherAlbumsByArtist() {
    const { data, isLoading, error } = useArtistAlbumsV2(session, artist, 0, 20, 'DESC', 'date');

    if (isLoading) return <div>loading</div>;
    if (error || !data) return <ErrorHandler error={error || 'unknown'} />;

    return (
      <SakuraAlbumList single>
        {data.map((album, i) => (
          <SakuraAlbum album={album} key={album.id} index={i} showArtist />
        ))}
      </SakuraAlbumList>
    );
  }
}
