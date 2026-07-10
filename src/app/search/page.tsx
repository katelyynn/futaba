"use client";

import { Suspense } from 'react';
import SearchClient from './page.client';

export default function Search({
  searchParams
}: { searchParams: Promise<{ query?: string }> }) {
  return (
    <Suspense>
      <SearchClient searchParams={searchParams} />
    </Suspense>
  )
}
