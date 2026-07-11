import { SakuraActions } from '@/components/header/actions.tsx';
import { SakuraBackground, SakuraHeader } from '@/components/header/header.tsx';
import { SakuraSongList } from '@/components/song/song.tsx';
import { SortableSong } from '@/components/song/sortable_song.tsx';
import { SakuraPage, SakuraSeparator, SakuraSplit } from '@/components/split/split.tsx';
import { ErrorHandler } from '@/errorHandler.tsx';
import { usePlaylist } from '@/hook/playlist.ts';
import { useSession } from '@/session.tsx';
import type { playlistFull } from '@/types/playlist.ts';
import { SortableContext } from '@dnd-kit/sortable';
import { useParams } from "react-router-dom";

export default function Playlist() {
  const { session } = useSession();
  const params = useParams();

  const id = params.id as string;

  const { data, isLoading, error } = usePlaylist(session, id);

  if (isLoading) return <div>loading</div>;
  if (error || !data) return <ErrorHandler error={error || 'unknown'} />;

  return (
    <>
      <SakuraBackground art={data.art} />
      <SakuraPage split>
        <SakuraSplit side="left">
          <h3>Tracklist</h3>
          <SortableContext items={(data as playlistFull).songs.map(s => s.id)}>
            <SakuraSongList>
                {(data as playlistFull).songs.map(song => (
                  <SortableSong song={song} key={song.id} container="album" songsList={(data as playlistFull).songs} showArt />
                ))}
            </SakuraSongList>
          </SortableContext>
        </SakuraSplit>
        <SakuraSeparator orientation="vertical" />
        <SakuraSplit side="right">
          <SakuraHeader art={data.art} name={data.name} type="playlist" />
          <SakuraActions songs={data.songs} count={data.songCount} type="playlist" />
          <h3>About</h3>
          <About />
        </SakuraSplit>
      </SakuraPage>
    </>
  )

  function About() {
    const comment = (data as playlistFull).comment;

    if (comment) {
      return (
        <div>
          {comment}
        </div>
      )
    }
  }
}
