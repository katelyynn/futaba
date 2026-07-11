import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home.tsx";
import { SessionProvider } from "@/session.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/nav/top_nav.tsx";
import { Draggable } from "@/components/drag/drag.tsx";
import { SideNav } from "@/components/nav/side_nav.tsx";
import { SakuraAside } from "@/components/aside/aside.tsx";
import { Player } from "@/components/player/player.tsx";
import Albums from "@/pages/albums/Albums.tsx";
import Album from "@/pages/albums/Album.tsx";
import Artists from "@/pages/artists/Artists.tsx";
import Artist from "@/pages/artists/Artist.tsx";
import { Appearance } from "@/pages/settings/Appearance.tsx";
import { useSettings } from "@/api/settings.ts";
import { usePlayer } from "@/api/player.ts";
import { FastAverageColor } from "fast-average-color";
import { convertColour } from "@/tools/colour.ts";
import Playlist from "@/pages/playlists/Playlist.tsx";
import { Playback } from "@/pages/settings/Playback.tsx";
import Search from "@/pages/search/Search.tsx";
import Provider from "@/provide.tsx";

function App() {
  const theme = useSettings(s => s.theme);
  const fullscreen = useSettings(s => s.fullscreen);

  const currentSong = usePlayer(s => s.currentSong);
  const colourFromNowPlaying = useSettings(s => s.colourFromNowPlaying);

  const hue = useSettings(s => s.hue);
  const sat = useSettings(s => s.sat);
  const lit = useSettings(s => s.lit);

  useEffect(() => {
    if (!currentSong || !currentSong?.art) return;

    if (!colourFromNowPlaying) {
      const host = document.body;

      host.style.removeProperty('--hue-album');
      host.style.removeProperty('--sat-album');
      host.style.removeProperty('--lit-album');

      return;
    }

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
      if (!currentSong || !currentSong?.art) return;

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
  }, [currentSong, colourFromNowPlaying]);

  useEffect(() => {
    const host = document.body;
    host.style.setProperty('--hue-user', hue.toString());
    host.style.setProperty('--sat-user', sat.toString());
    host.style.setProperty('--lit-user', lit.toString());
  }, [hue, sat, lit]);

  useEffect(() => {
    const host = document.body;
    host.setAttribute('data-futaba--theme', theme);
  }, [ theme ]);

  return (
    <Provider>
      <BrowserRouter>
        <TopNav />
        <Draggable>
          <div className="middle">
            <SideNav />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/albums" element={<Albums />} />
                <Route path="/album/:id" element={<Album />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artist/:id" element={<Artist />} />
                <Route path="/settings/" element={<Appearance />} />
                <Route path="/settings/playback" element={<Playback />} />
                <Route path="/playlist/:id" element={<Playlist />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </main>
            <SakuraAside />
          </div>
        </Draggable>
        <Player />
      </BrowserRouter>
    </Provider>
  )
}

export default App;
