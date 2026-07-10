"use client";

import { SakuraAlbum, SakuraAlbumList, SakuraAlbumListScroller } from '@/app/_components/album/album';
import { SakuraGroup, SakuraGroupList } from '@/app/_components/group/group';
import { SakuraActions } from '@/app/_components/header/actions';
import { SakuraBackground, SakuraHeader } from '@/app/_components/header/header';
import { SakuraPage, SakuraSeparator, SakuraSplit } from '@/app/_components/split/split';
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
  if (error || !data) return <ErrorHandler error={error || 'unknown'} />

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
      <SakuraBackground art={data.art} />
      <SakuraPage split>
        <SakuraSplit side="left">
          <SakuraGroupList>
            {sortedGroups && sortedGroups.map(([group, items]) => (
              <SakuraGroup name={group} key={group}>
                <SakuraAlbumList key={group} single>
                  {items.map((album, i) => (
                    <SakuraAlbum album={album} key={album.id} index={i} />
                  ))}
                </SakuraAlbumList>
              </SakuraGroup>
            ))}
          </SakuraGroupList>
        </SakuraSplit>
        <SakuraSeparator orientation="vertical" />
        <SakuraSplit side="right">
          <SakuraHeader art={data.art} name={data.name} type="artist" />
        </SakuraSplit>
      </SakuraPage>
    </>
  )
}
