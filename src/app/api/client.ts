import md5 from "md5";

export interface session {
  server: string,
  username: string,
  password: string
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

export async function request(session: session, endpoint: string, params = {}) {
  const auth = createAuth(session);

  const url = new URL(`/rest/${endpoint}.view`, auth.baseURL);

  url.search = new URLSearchParams({
    ...auth.params,
    ...params
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("unexpected api error");

  const json = await res.json();
  console.log('json', json);
  const data = json["subsonic-response"];
  console.log('data', data);

  if (data.status == "failed") {
    throw new Error(data.error?.message || "unexpected api error (2)");
  }

  return data;
}