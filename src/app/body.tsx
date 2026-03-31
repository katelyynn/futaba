"use client";

import React from 'react';
import { useSettings } from './api/settings';
import { SakuraFullscreenView } from './_components/fullscreen/fullscreen';
import Provider from './provide';

export function Body({
  children
}: { children: React.ReactNode }) {
  const theme = useSettings(s => s.theme);
  const fullscreen = useSettings(s => s.fullscreen);

  return (
    <body data-futaba--theme={theme}>
      <Provider>
        {fullscreen ? <SakuraFullscreenView /> : children}
      </Provider>
    </body>
  )
}