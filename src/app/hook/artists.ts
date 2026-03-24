"use client";

import { useQuery } from '@tanstack/react-query';
import { auth } from '../api/client';
import { getArtists } from '../api/artists';

export function useArtists(auth: auth) {
  return useQuery({
    queryKey: ["artists"],
    queryFn: () => getArtists(auth)
  });
}