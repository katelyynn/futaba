"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getAlbum, getAlbumInfo, getAlbums } from '../api/album';
import { getPlaylist, getPlaylists } from '../api/playlist';

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