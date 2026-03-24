"use client";

import { SakuraSong } from '@/app/_components/song/song';
import { useAlbum } from '@/app/hook/album';
import { useSession } from '@/app/session';
import { useParams } from 'next/navigation';

export default function Album() {
  const { session } = useSession();
  const params = useParams();

  const id = params.id as string;

  const { data, isLoading, error } = useAlbum(session, id);

  if (isLoading) return <div>loading</div>;
  if (error) return <div>error</div>;

  console.log('album data', data);

  return (
    <div>
      <strong>{data.name}</strong>
      <div>
        {data.songs.map(song => (
          <SakuraSong song={song} key={song.id} />
        ))}
      </div>
    </div>
  )
}