"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getArtist, getArtists, getArtistsV2 } from '../api/artist';

export function useArtistsV2(session: session | null, start = 0, end = 20, order = 'DESC', sort = 'recently_added') {
  return useQuery({
    queryKey: ["artistsV2", session, start, end, order, sort],
    queryFn: () => getArtistsV2(session!, start, end, order, sort),
    staleTime: 10000
  });
}

export function useArtists(session: session | null) {
  console.log('useArtists', session);

  return useQuery({
    queryKey: ["artists", session],
    queryFn: () => getArtists(session!)
  });
}

export function useArtist(session: session | null, id: string | null) {
  console.log('useArtist', session);

  return useQuery({
    queryKey: ["artist", id, session],
    queryFn: () => getArtist(session!, id!)
  });
}
