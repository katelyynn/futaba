"use client";

import React from 'react';
import { useSettings } from './api/settings';

export function Body({
  children
}: { children: React.ReactNode }) {
  const theme = useSettings(s => s.theme);

  return (
    <body data-futaba--theme={theme}>
      {children}
    </body>
  )
}