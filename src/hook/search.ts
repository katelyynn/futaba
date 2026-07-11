import { useQuery } from '@tanstack/react-query';
import type { session } from '@/api/client.ts';
import { search } from '@/api/search.ts';

export function useSearch(session: session | null, query: string) {
  return useQuery({
    queryKey: ["search", session, query],
    queryFn: () => search(session!, query)
  });
}
