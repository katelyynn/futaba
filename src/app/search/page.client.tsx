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
import { use } from 'react';

export default function SearchClient({
  searchParams
}: { searchParams: Promise<{ query?: string }> }) {
  const { session } = useSession();

  const params = use(searchParams);
  const query = params.query || '';

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
