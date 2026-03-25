"use client";

import { useSession } from '@/app/session';
import { SakuraButton } from '../button/button';
import { IconChevronRight } from '@tabler/icons-react';

export function AuthStatus() {
  const { session, setSession } = useSession();

  if (!session) {
    return (
      <div>
        <p>Not logged in</p>
        <SakuraButton elem="button" primary onClick={() => {
          setSession(null);
          window.location.href = "/auth/login";
        }}>
          Log in
          <IconChevronRight size={16} />
        </SakuraButton>
      </div>
    );
  }

  return (
    <div>
      <p>Logged in as {session.username}</p>
    </div>
  )
}