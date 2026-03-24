"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { getCoverArt } from '../api/cover';

export function useCoverArt(session: session | null, id: string | null) {
  return useQuery({
    queryKey: ["getCoverArt", id, session],
    queryFn: () => getCoverArt(session!, id!)
  });
}