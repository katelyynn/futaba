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

  const ordering = [
    "album",
    "deluxe",
    "ep",
    "single",
    "live",
    "compilation",
    "other"
  ];

  let sortedGroups;

  if (data.albums) {
    sortedGroups = Object.entries(data.albums).sort(([a], [b]) => {
      const indexA = ordering.indexOf(a);
      const indexB = ordering.indexOf(b);

      return (indexA == -1 ? 20 : indexA) - (indexB == -1 ? 20 : indexB);
    });
  }

  return (
    <>
      <SakuraHeader data={data} type="artist" />
      <SakuraGroupList>
        {sortedGroups && sortedGroups.map(([group, items]) => (
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