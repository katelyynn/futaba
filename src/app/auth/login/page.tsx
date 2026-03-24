import { createAuth, request } from '@/app/api/client';
import { useState } from 'react';

export default function Login({ onLogon }) {
  const [ server, setServer ] = useState("");
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    try {
      const auth = createAuth(username, password, server);

      await request(auth, "ping");

      localStorage.setItem("auth", JSON.stringify(auth));
      onLogon(auth);
    } catch (e) {
      setError(e);
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