import { SakuraAlbum, SakuraAlbumList } from '@/components/album/album.tsx';
import { SakuraGroup, SakuraGroupList } from '@/components/group/group.tsx';
import { SakuraBackground, SakuraHeader } from '@/components/header/header.tsx';
import { SakuraPage, SakuraSeparator, SakuraSplit } from '@/components/split/split.tsx';
import { ErrorHandler } from '@/errorHandler.tsx';
import { useArtist } from '@/hook/artist.ts';
import { useSession } from '@/session.tsx';
import { useParams } from "react-router-dom";

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
