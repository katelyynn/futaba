"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { search } from '../api/search';

export function useSearch(session: session | null, query: string) {
  return useQuery({
    queryKey: ["search", session],
    queryFn: () => search(session!, query)
  });
}
