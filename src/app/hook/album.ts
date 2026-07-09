"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getAlbum, getAlbumInfo, getAlbums, getAlbumsV2, getAlbumV2 } from '../api/album';

export function useAlbumsV2(session: session | null, start = 0, end = 20, order = 'DESC', sort = 'recently_added') {
  return useQuery({
    queryKey: ["albumsV2", session, start, end, order, sort],
    queryFn: () => getAlbumsV2(session!, start, end, order, sort)
  });
}

export function useAlbums(session: session | null, size?: number, nowPlayingId?: string) {
  console.log('useALBUMS', session);

  return useQuery({
    queryKey: ["albums", session, size, nowPlayingId],
    queryFn: () => getAlbums(session!, size),
    staleTime: 10000
  });
}

export function useAlbumV2(session: session | null, id: string | null) {
  return useQuery({
    queryKey: ["albumV2", id, session],
    queryFn: () => getAlbumV2(session!, id!)
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
