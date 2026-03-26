"use client";

import { useSearchParams } from 'next/navigation';
import { SakuraAlbum, SakuraAlbumList } from '../_components/album/album';
import { SakuraArtist, SakuraArtistList } from '../_components/artist/artist';
import { ErrorHandler } from '../errorHandler';
import { useAlbums } from '../hook/album';
import { useSearch } from '../hook/search';
import { useSession } from '../session';
import { SakuraGroup, SakuraGroupList } from '../_components/group/group';
import { SakuraSong, SakuraSongList } from '../_components/song/song';

export default function Search() {
  const { session } = useSession();

  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";

  const { data, isLoading, error } = useSearch(session, query);

  if (isLoading) return <div>loading</div>;
  if (error) return <ErrorHandler error={error} />

  console.log('search data', data);

  return (
    <>
      <SakuraGroupList>
        <SakuraGroup name="Albums">
          <SakuraAlbumList>
            {data.albums.map(album => (
              <SakuraAlbum album={album} key={album.id} />
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
        <SakuraGroup name="Artists">
          <SakuraArtistList>
            {data.artists.map(artist => (
              <SakuraArtist artist={artist} key={artist.id} />
            ))}
          </SakuraArtistList>
        </SakuraGroup>
      </SakuraGroupList>
    </>
  )
}