"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getAlbum, getAlbums } from '../api/album';

export function useAlbums(session: session | null) {
  console.log('useALBUMS', session);

  return useQuery({
    queryKey: ["albums", session],
    queryFn: () => getAlbums(session!)
  });
}

export function useAlbum(session: session | null, id: string | null) {
  console.log('useAlbum', session);

  return useQuery({
    queryKey: ["album", id, session],
    queryFn: () => getAlbum(session!, id!)
  });
}