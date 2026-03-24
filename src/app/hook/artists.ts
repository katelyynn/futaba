"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getArtists } from '../api/artists';

export function useArtists(session: session | null) {
  console.log('useArtists', session);

  return useQuery({
    queryKey: ["artists", session],
    queryFn: () => getArtists(session!)
  });
}