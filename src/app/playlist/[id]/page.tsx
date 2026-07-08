"use client";

import { SakuraActions } from '@/app/_components/header/actions';
import { SakuraBackground, SakuraHeader } from '@/app/_components/header/header';
import { SakuraDisc, SakuraSong, SakuraSongList } from '@/app/_components/song/song';
import { SortableSong } from '@/app/_components/song/sortable_song';
import { SakuraPage, SakuraSeparator, SakuraSplit } from '@/app/_components/split/split';
import { ErrorHandler } from '@/app/errorHandler';
import { usePlaylist } from '@/app/hook/playlist';
import { useSession } from '@/app/session';
import { album_full } from '@/app/types/album';
import { playlistFull } from '@/app/types/playlist';
import { SortableContext } from '@dnd-kit/sortable';
import { useParams } from 'next/navigation';

export default function Playlist() {
  const { session } = useSession();
  const params = useParams();

  const id = params.id as string;

  const { data, isLoading, error } = usePlaylist(session, id);

  if (isLoading) return <div>loading</div>;
  if (error) return <ErrorHandler error={error} />;

  return (
    <>
      <SakuraBackground data={data as playlistFull} />
      <SakuraPage split>
        <SakuraSplit side="left">
          <SakuraActions data={data as playlistFull} type="playlist" />
          <h3>Tracklist</h3>
          <SortableContext items={(data as playlistFull).songs.map(s => s.id)}>
            <SakuraSongList>
                {(data as playlistFull).songs.map(song => (
                  <SortableSong song={song} key={song.id} container="album" songsList={(data as playlistFull).songs} showArt />
                ))}
            </SakuraSongList>
          </SortableContext>
        </SakuraSplit>
        <SakuraSeparator orientation="vertical" />
        <SakuraSplit side="right">
          <SakuraHeader data={data as playlistFull} type="playlist" />
          <h3>About</h3>
          <About />
        </SakuraSplit>
      </SakuraPage>
    </>
  )

  function About() {
    const comment = (data as playlistFull).comment;

    if (comment) {
      return (
        <div>
          {comment}
        </div>
      )
    }
  }
}
