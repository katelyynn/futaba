"use client";

import { SakuraHeader } from '@/app/_components/header/header';
import { SakuraImage } from '@/app/_components/image/image';
import { SakuraSong, SakuraSongList } from '@/app/_components/song/song';
import { ErrorHandler } from '@/app/errorHandler';
import { useAlbum } from '@/app/hook/album';
import { useSession } from '@/app/session';
import { album_full } from '@/app/types/album';
import { useParams } from 'next/navigation';

export default function Album() {
  const { session } = useSession();
  const params = useParams();

  const id = params.id as string;

  const { data, isLoading, error } = useAlbum(session, id);

  if (isLoading) return <div>loading</div>;
  if (error) return <ErrorHandler error={error} />

  console.log('album data', data);

  return (
    <>
      <SakuraHeader data={data as album_full} type="album" />
      <SakuraSongList>
        {data.songs.map(song => (
          <SakuraSong song={song} key={song.id} />
        ))}
      </SakuraSongList>
    </>
  )
}