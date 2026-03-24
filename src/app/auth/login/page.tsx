"use client";

import { createAuth, request } from '@/app/api/client';
import { useSession } from '@/app/session';
import { useState } from 'react';

export default function Login() {
  const { setSession } = useSession();

  const [ server, setServer ] = useState("");
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState<string | null>(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    try {
      const session = { server, username, password };

      await request(session, "ping");

      setSession(session);
    } catch (e) {
      setError(e instanceof Error ? e.message : "login failed");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input placeholder="server" value={server} onChange={e => setServer(e.target.value)} />
      <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>login</button>
      {error && <p>{error}</p>}
    </form>
  );
}