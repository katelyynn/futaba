"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getArtist, getArtists } from '../api/artist';
import { getAlbum } from '../api/album';

export function useArtists(session: session | null) {
  console.log('useArtists', session);

  return useQuery({
    queryKey: ["artists", session],
    queryFn: () => getArtists(session!)
  });
}

export function useAlbum(session: session | null, id: string | null) {
  console.log('useAlbum', session);

  return useQuery({
    queryKey: ["album", id, session],
    queryFn: () => getAlbum(session!, id!)
  });
}