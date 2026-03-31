"use client";

import React, { useEffect } from 'react';
import { useSettings } from './api/settings';
import { SakuraFullscreenView } from './_components/fullscreen/fullscreen';
import Provider from './provide';
import { usePlayer } from './api/player';
import { FastAverageColor } from 'fast-average-color';
import { convertColour } from './tools/colour';

export function Body({
  children
}: { children: React.ReactNode }) {
  const theme = useSettings(s => s.theme);
  const fullscreen = useSettings(s => s.fullscreen);

  const currentSong = usePlayer(s => s.currentSong);

  useEffect(() => {
    if (!currentSong || !currentSong?.art) return;

    const fac = new FastAverageColor();

    const getColour = async (url: string) => {
      const image = new Image();

      image.crossOrigin = "anonymous";
      image.src = url;

      await image.decode();

      const colour = fac.getColor(image);

      return colour.value;
    }

    let cancelled = false;

    const run = async () => {
      const values = await getColour(currentSong.art);
      if (cancelled) return;

      const { h, s, l } = convertColour(values);

      const host = document.body;
      host.style.setProperty('--hue-album', h.toString());
      host.style.setProperty('--sat-album', s.toString());
      host.style.setProperty('--lit-album', l.toString());
    }

    run();

    return () => {
      cancelled = true;
    }
  }, [ currentSong ]);

  return (
    <body data-futaba--theme={theme}>
      <Provider>
        {fullscreen ? <SakuraFullscreenView /> : children}
      </Provider>
    </body>
  )
}