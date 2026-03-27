"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getAlbum, getAlbumInfo, getAlbums } from '../api/album';

export function useAlbums(session: session | null, size?: number, nowPlayingId?: string) {
  console.log('useALBUMS', session);

  return useQuery({
    queryKey: ["albums", session, size, nowPlayingId],
    queryFn: () => getAlbums(session!, size),
    staleTime: 10000
  });
}

export function useAlbum(session: session | null, id: string | null) {
  console.log('useAlbum', session);

  return useQuery({
    queryKey: ["album", id, session],
    queryFn: () => getAlbum(session!, id!)
  });
}

export function useAlbumInfo(session: session | null, id: string | null) {
  console.log('useAlbum', session);

  return useQuery({
    queryKey: ["albumInfo", id, session],
    queryFn: () => getAlbumInfo(session!, id!)
  });
}