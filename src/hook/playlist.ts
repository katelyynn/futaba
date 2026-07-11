import { useQuery } from '@tanstack/react-query';
import type { session } from '@/api/client.ts';
import { getPlaylist, getPlaylists } from '@/api/playlist.ts';

export function usePlaylists(session: session | null) {
  return useQuery({
    queryKey: ["playlists", session],
    queryFn: () => getPlaylists(session!),
    staleTime: 10000
  });
}

export function usePlaylist(session: session | null, id: string | null) {
  return useQuery({
    queryKey: ["playlist", id, session],
    queryFn: () => getPlaylist(session!, id!)
  });
}
