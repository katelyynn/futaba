"use client";

import { useQuery } from '@tanstack/react-query';
import { session } from '../api/client';
import { startScan } from '../api/scan';

export function useScan(session: session | null) {
  return useQuery({
    queryKey: ["scan", session],
    queryFn: () => startScan(session!)
  });
}
