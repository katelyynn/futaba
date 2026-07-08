"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { session, validateSessionV2 } from './api/client';

interface sessionContext {
  session: session | null,
  setSession: (session: session | null) => void
}

const SessionContext = createContext<sessionContext | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [ session, setSession ] = useState<session | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) {
      setSession(JSON.parse(saved));

      validateSessionV2(JSON.parse(saved))
        .then((session) => {
          setSession(session);
        })
        .catch((e) => {
          console.error('failure validating login', e);
          setSession(null);
          localStorage.removeItem('session');
        });
    }
  }, []);

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    } else {
      localStorage.removeItem("session");
    }
  }, [ session ]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside a SessionProvider");

  return context;
}
