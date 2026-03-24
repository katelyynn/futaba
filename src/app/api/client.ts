import md5 from "md5";

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

export function createAuth(username: string, password: string, server: string) {
  const salt = Math.random().toString(36).slice(2, 10);
  const token = md5(password + salt);

  return {
    baseURL: normaliseURL(server),
    params: {
      u: username,
      t: token,
      s: salt,
      v: "1.16.1",
      c: "futaba",
      f: "json"
    }
  } as auth;
}

export async function request(auth: auth, endpoint: string, params = {}) {
  const url = new URL(`/rest/${endpoint}.view`, auth.baseURL);

  url.search = new URLSearchParams({
    ...auth.params,
    ...params
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("unexpected api error");

  const json = await res.json();
  return json["subsonic-response"];
}