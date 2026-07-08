import md5 from "md5";

export interface session {
  server: string,
  username: string,
  password: string,
  jwt?: string | null
}

export interface auth {
  baseURL: string,
  params: {
    u: string,
    t: string,
    s: string,
    v: string,
    c: string,
    f: string
  }
}

function normaliseURL(url: string) {
  url = url.trim().replace(/\/+$/, "");

  if (!url.startsWith("http")) {
    return "http://" + url;
  }

  return url;
}

// SUBSONIC
export function createAuth(session: session) {
  const salt = Math.random().toString(36).slice(2, 10);
  const token = md5(session.password + salt);

  return {
    baseURL: normaliseURL(session.server),
    params: {
      u: session.username,
      t: token,
      s: salt,
      v: "1.16.1",
      c: "futaba",
      f: "json"
    }
  } as auth;
}

interface authenticateV2 {
  baseURL: string,
  token: string
}

// NATIVE
export async function authenticateV2(session: session): Promise<authenticateV2> {
  const baseURL = normaliseURL(session.server);

  const url = new URL(`/auth/login`, baseURL);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: session.username,
      password: session.password
    })
  });

  if (!res.ok) {
    throw new Error('failed to authenticate');
  }

  const data = await res.json();

  return {
    baseURL,
    token: data.token
  }
}

export async function requestV2(session: session, endpoint: string, params = {}) {
  if (!session.jwt) {
    throw new Error('missing jwt, authenticate first');
  }

  const baseURL = normaliseURL(session.server);
  const url = new URL(`/${endpoint}`, baseURL);

  url.search = new URLSearchParams({
    ...params
  });

  const res = await fetch(url, {
    headers: {
      'x-nd-authorization': `Bearer ${session.jwt}`
    }
  });

  if (!res.ok) {
    if (res.status == 401) {
      throw new Error('session expired');
    }

    throw new Error('unexpected apiV2 error');
  }

  const newToken: string | null = res.headers.get('x-nd-authorization');

  const data = await res.json();
  console.info('REQUEST TO', endpoint, 'returned:', data);

  return {
    data,
    token: newToken
  };
}

export async function request(session: session, endpoint: string, params = {}) {
  const auth = createAuth(session);

  const url = new URL(`/rest/${endpoint}.view`, auth.baseURL);

  url.search = new URLSearchParams({
    ...auth.params,
    ...params
  });

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('unexpected api error');
  }

  console.log('res', res);
  const json = await res.json();
  console.log('json', json);
  const data = json["subsonic-response"];
  console.log('data', data);

  if (data.status == "failed") {
    throw new Error(data.error?.message || "unexpected api error (2)");
  }

  return data;
}

export async function validateSessionV2(session: session): Promise<session> {
  const res = await requestV2(session, 'auth/login');

  return {
    ...session,
    jwt: res.token
  }
}
