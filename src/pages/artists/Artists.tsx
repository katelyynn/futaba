import { SakuraArtist, SakuraArtistList } from '@/components/artist/artist.tsx';
import { BrowseTabs } from '@/pages/browse/tab.tsx';
import { useArtistsV2 } from '@/hook/artist.ts';
import { useSession } from '@/session.tsx';

export default function Artists() {
  const { session } = useSession();

  const { data, isLoading, error } = useArtistsV2(session, 0, 100, 'DESC', 'play_date');
  if (isLoading || error || !data) return (
    <>
      <BrowseTabs />
    </>
  );

  console.log('artist data', data);

  return (
    <>
      <BrowseTabs />
      <SakuraArtistList>
        {data.map((artist, i) => (
          <SakuraArtist artist={artist} key={i} index={i} />
        ))}
      </SakuraArtistList>
    </>
  )
}
