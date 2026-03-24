"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getArtist, getArtists } from '../api/artist';

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