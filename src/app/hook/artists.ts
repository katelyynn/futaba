"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getArtists } from '../api/artists';

export function useArtists(session: session | null) {
  return useQuery({
    queryKey: ["artists"],
    queryFn: () => getArtists(session!),
    enabled: !!session
  });
}