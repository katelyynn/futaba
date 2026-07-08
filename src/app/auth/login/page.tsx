"use client";

import { SakuraButton } from '@/app/_components/button/button';
import { SakuraInput } from '@/app/_components/input/input';
import { Column, Span } from '@/app/_components/layout/layout';
import { SakuraSerif } from '@/app/_components/serif/serif';
import { authenticateV2, createAuth, request } from '@/app/api/client';
import { useSession } from '@/app/session';
import { IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';

export default function Login() {
  const { setSession } = useSession();

  const [ server, setServer ] = useState("127.0.0.1:4533");
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState<string | null>(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    try {
      const session = { server, username, password };

      const result = await authenticateV2(session);

      setSession({
        ...session,
        jwt: result.token
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "login failed");
    }
  }

  return (
    <Span>
      <Column>
        <SakuraSerif>Login to <b>futaba</b></SakuraSerif>
        <form onSubmit={handleLogin}>
          <SakuraInput placeholder="Server" value={server} onChange={e => setServer(e.target.value)} />
          <SakuraInput placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <SakuraInput placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <SakuraButton elem="button" primary>
            Login
            <IconChevronRight size={16} />
          </SakuraButton>
          {error && <p>{error}</p>}
        </form>
      </Column>
    </Span>
  );
}
