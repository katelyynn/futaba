import { useQuery } from '@tanstack/react-query';
import type { session } from '@/api/client.ts';
import { getCoverArt } from '@/api/cover.ts';

export function useCoverArt(session: session | null, id: string | null) {
  return useQuery({
    queryKey: ["getCoverArt", id, session],
    queryFn: () => getCoverArt(session!, id!)
  });
}
