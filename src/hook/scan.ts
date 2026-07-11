import { useQuery } from '@tanstack/react-query';
import type { session } from '@/api/client.ts';
import { startScan } from '@/api/scan.ts';

export function useScan(session: session | null) {
  return useQuery({
    queryKey: ["scan", session],
    queryFn: () => startScan(session!)
  });
}
