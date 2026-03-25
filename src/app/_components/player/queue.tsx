import { usePlayer } from '@/app/api/player';
import { SakuraSong, SakuraSongList } from '../song/song';
import { song } from '@/app/types/song';

export function SakuraQueue() {
  const queue: song[] = usePlayer(s => s.queue);

  return (
    <SakuraSongList>
      <h4>Queue</h4>
      {queue.map(song => <SakuraSong song={song} key={song.id} />)}
    </SakuraSongList>
  )
}