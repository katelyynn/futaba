"use client";

import { SakuraAlbum, SakuraAlbumList } from '@/app/_components/album/album';
import { SakuraGroup, SakuraGroupList } from '@/app/_components/group/group';
import { SakuraHeader } from '@/app/_components/header/header';
import { ErrorHandler } from '@/app/errorHandler';
import { useArtist } from '@/app/hook/artist';
import { useSession } from '@/app/session';
import { useParams } from 'next/navigation';

export default function Artist() {
  const { session } = useSession();
  const params = useParams();

  const id = params.id as string;

  const { data, isLoading, error } = useArtist(session, id);

  if (isLoading) return <div>loading</div>;
  if (error) return <ErrorHandler error={error} />

  console.log('artist data', data);

  return (
    <>
      <SakuraHeader data={data} type="artist" />
      <SakuraGroupList>
        {Object.entries(data.albums).map(([group, items]) => (
          <SakuraGroup name={group} key={group}>
            <SakuraAlbumList key={group}>
              {items.map(album => (
                <SakuraAlbum album={album} key={album.id} />
              ))}
            </SakuraAlbumList>
          </SakuraGroup>
        ))}
      </SakuraGroupList>
    </>
  )
}