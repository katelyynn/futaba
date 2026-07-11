"use client";

import { SakuraButton } from '@/components/button/button.tsx';
import { SakuraInput } from '@/components/input/input.tsx';
import { Column, Span } from '@/components/layout/layout.tsx';
import { SakuraSerif } from '@/components/serif/serif.tsx';
import { authenticateV2 } from '@/api/client.ts';
import { useSession } from '@/session.tsx';
import { IconChevronRight } from '@tabler/icons-react';
import { SubmitEventHandler, useState } from 'react';

export default function Login() {
  const { setSession } = useSession();

  const [ server, setServer ] = useState("127.0.0.1:4533");
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState<string | null>(null);

  const handleLogin: SubmitEventHandler<HTMLFormElement> = async (e) => {
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
