"use client";

import { SakuraButton } from '@/app/_components/button/button';
import { SakuraInput } from '@/app/_components/input/input';
import { Column, Span } from '@/app/_components/layout/layout';
import { createAuth, request } from '@/app/api/client';
import { useSession } from '@/app/session';
import { useState } from 'react';
import { ChevronRight } from 'tabler-icons-react';

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
    <Span>
      <Column>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <SakuraInput placeholder="Server" value={server} onChange={e => setServer(e.target.value)} />
          <SakuraInput placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <SakuraInput placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <SakuraButton elem="button" primary>
            Login
            <ChevronRight size={16} />
          </SakuraButton>
          {error && <p>{error}</p>}
        </form>
      </Column>
    </Span>
  );
}