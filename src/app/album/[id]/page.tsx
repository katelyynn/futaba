"use client";

import { SakuraHeader } from '@/app/_components/header/header';
import { SakuraImage } from '@/app/_components/image/image';
import { SakuraDisc, SakuraSong, SakuraSongList } from '@/app/_components/song/song';
import { SortableSong } from '@/app/_components/song/sortable_song';
import { SakuraPage, SakuraSeparator, SakuraSplit } from '@/app/_components/split/split';
import { ErrorHandler } from '@/app/errorHandler';
import { useAlbum, useAlbumInfo } from '@/app/hook/album';
import { useSession } from '@/app/session';
import { album_full } from '@/app/types/album';
import { SortableContext } from '@dnd-kit/sortable';
import { useParams } from 'next/navigation';

export default function Album() {
  const { session } = useSession();
  const params = useParams();

  const id = params.id as string;

  const { data, isLoading, error } = useAlbum(session, id);

  if (isLoading) return <div>loading</div>;
  if (error) return <ErrorHandler error={error} />;

  console.log('album data', data);

  return (
    <>
      <SakuraHeader data={data as album_full} type="album" />
      <SakuraPage split>
        <SakuraSplit side="left">
          <h3>Tracklist</h3>
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
        </SakuraSplit>
        <SakuraSeparator orientation="vertical" />
        <SakuraSplit side="right">
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
}