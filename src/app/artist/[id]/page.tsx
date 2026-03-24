"use client";

import { SakuraAlbum } from '@/app/_components/album/album';
import { useArtist } from '@/app/hook/artist';
import { useSession } from '@/app/session';
import { useParams } from 'next/navigation';

export default function Artist() {
  const { session } = useSession();
  const params = useParams();

  const id = params.id as string;

  const { data, isLoading, error } = useArtist(session, id);

  if (isLoading) return <div>loading</div>;
  if (error) return <div>error</div>;

  console.log('artist data', data);

  return (
    <div>
      <strong>{data.name}</strong>
      <div>
        {data.albums.map(album => (
          <SakuraAlbum album={album} key={album.id} />
        ))}
      </div>
    </div>
  )
}