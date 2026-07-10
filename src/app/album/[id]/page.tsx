"use client";

import { SakuraAlbum, SakuraAlbumList } from '@/app/_components/album/album';
import { SakuraGroup, SakuraGroupList } from '@/app/_components/group/group';
import { SakuraActions } from '@/app/_components/header/actions';
import { SakuraBackground, SakuraHeader } from '@/app/_components/header/header';
import { SakuraImage } from '@/app/_components/image/image';
import { META_ICON_SIZE, META_ICON_SIZE_BIG, SakuraMeta, SakuraMetaLabel, SakuraMetaList } from '@/app/_components/meta/meta';
import { SakuraDisc, SakuraSong, SakuraSongList } from '@/app/_components/song/song';
import { SortableSong } from '@/app/_components/song/sortable_song';
import { SakuraPage, SakuraSeparator, SakuraSplit } from '@/app/_components/split/split';
import { ErrorHandler } from '@/app/errorHandler';
import { useAlbum, useAlbumInfo, useAlbumV2 } from '@/app/hook/album';
import { useArtistAlbumsV2 } from '@/app/hook/artist';
import { useSession } from '@/app/session';
import { bytes } from '@/app/tools/size';
import { album_full } from '@/app/types/album';
import { SortableContext } from '@dnd-kit/sortable';
import { IconCalendarWeekFilled, IconFolder, IconHeadphonesFilled, IconMusic, IconPlayerPlayFilled } from '@tabler/icons-react';
import { DateTime, Duration } from 'luxon';
import { useParams } from 'next/navigation';

import styles from './page.module.css';

export default function Album() {
  const { session } = useSession();
  const params = useParams();

  const id = params.id as string;

  const { data: dataV2, isLoading: isLoadingV2, error: errorV2 } = useAlbumV2(session, id);
  const { data, isLoading, error } = useAlbum(session, id);

  if (isLoadingV2 || isLoading) return <div>loading</div>;
  if (errorV2 || !dataV2) return <ErrorHandler error={errorV2 || 'unknown'} />;
  if (error || !data) return <ErrorHandler error={error || 'unknown'} />;

  console.log('album data V2', dataV2);
  console.log('album data', data);

  const duration = Duration.fromMillis(dataV2.duration * 1000).shiftTo('hours', 'minutes', 'seconds').toObject();

  if (duration.seconds) duration.seconds = Math.round(duration.seconds);

  const artist = dataV2.artistId;

  return (
    <>
      <SakuraBackground data={dataV2!} />
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
              {dataV2.label != '' && (
                <label className={styles.license}>© {dataV2.label}</label>
              )}
            </SakuraGroup>
            <SakuraGroup name="More from this artist">
              <OtherAlbumsByArtist />
            </SakuraGroup>
          </SakuraGroupList>
        </SakuraSplit>
        <SakuraSeparator orientation="vertical" />
        <SakuraSplit side="right">
          <SakuraHeader data={dataV2!} type="album" />
          <SakuraActions data={data as album_full} type="album" />
          <SakuraMetaList space>
            <SakuraMeta name="Release date" small={false}>
              <IconCalendarWeekFilled size={META_ICON_SIZE_BIG} />
              <SakuraMetaLabel>Release date</SakuraMetaLabel>
              {DateTime.fromISO(dataV2.date).toLocaleString(DateTime.DATE_MED)}
            </SakuraMeta>
            <SakuraMeta name="Song count" small={false}>
              <IconMusic size={META_ICON_SIZE_BIG} />
              <SakuraMetaLabel>Song count</SakuraMetaLabel>
              {dataV2.songs} song{dataV2.songs > 1 && "s"}, {duration.hours ? `${duration.hours}h ` : ''}{duration.minutes}m
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
            <SakuraMeta name="File size" small={false}>
              <IconFolder size={META_ICON_SIZE_BIG} />
              <SakuraMetaLabel>File size</SakuraMetaLabel>
              {bytes(dataV2.size)}
            </SakuraMeta>
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
          <SakuraAlbum album={album} key={album.id} index={i} />
        ))}
      </SakuraAlbumList>
    );
  }
}
