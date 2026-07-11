import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home.tsx";
import { SessionProvider } from "@/session.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { TopNav } from "@/components/nav/top_nav.tsx";
import { Draggable } from "@/components/drag/drag.tsx";
import { SideNav } from "@/components/nav/side_nav.tsx";
import { SakuraAside } from "@/components/aside/aside.tsx";
import { Player } from "@/components/player/player.tsx";
import Albums from "@/pages/Albums.tsx";
import Artists from "@/pages/Artists.tsx";

function App() {
  const [ queryClient ] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopNav />
          <Draggable>
            <div className="middle">
              <SideNav />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/albums" element={<Albums />} />
                  <Route path="/artists" element={<Artists />} />
                </Routes>
              </main>
              <SakuraAside />
            </div>
          </Draggable>
          <Player />
        </BrowserRouter>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default App;
