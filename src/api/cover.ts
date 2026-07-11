import { createAuth, session } from './client.ts';

export function getCoverArt(session: session, id: string) {
  const auth = createAuth(session);

  const url = new URL(`/rest/getCoverArt.view`, auth.baseURL);

  /* @ts-expect-error guhh */
  url.search = new URLSearchParams({
    ...auth.params,
    id
  });

  console.log('cover', url.toString());

  return url.toString();
}
