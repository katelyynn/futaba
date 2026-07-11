import { SakuraAlbum, SakuraAlbumList } from '@/components/album/album.tsx';
import { SakuraArtist, SakuraArtistList } from '@/components/artist/artist.tsx';
import { ErrorHandler } from '@/errorHandler.tsx';
import { useSearch } from '@/hook/search.ts';
import { useSession } from '@/session.tsx';
import { SakuraGroup, SakuraGroupList } from '@/components/group/group.tsx';
import { SakuraSong, SakuraSongList } from '@/components/song/song.tsx';
import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [ searchParams ] = useSearchParams();

  const query = searchParams.get("query") || "";

  const { session } = useSession();

  const { data, isLoading, error } = useSearch(session, query);

  if (isLoading) return <div>loading</div>;
  if (error || !data) return <ErrorHandler error={error || 'unknown'} />

  console.log('search data', data);

  return (
    <>
      <SakuraGroupList>
        <SakuraGroup name="Artists">
          <SakuraArtistList>
            {data.artists.map(artist => (
              <SakuraArtist artist={artist} key={artist.id} />
            ))}
          </SakuraArtistList>
        </SakuraGroup>
        <SakuraGroup name="Albums">
          <SakuraAlbumList>
            {data.albums.map(album => (
              <SakuraAlbum album={album} key={album.id} showArtist />
            ))}
          </SakuraAlbumList>
        </SakuraGroup>
        <SakuraGroup name="Songs">
          <SakuraSongList>
            {data.songs.map(song => (
              <SakuraSong song={song} key={song.id} showArt hideIndex />
            ))}
          </SakuraSongList>
        </SakuraGroup>
      </SakuraGroupList>
    </>
  )
}
