import { request } from './client.ts';
import type { session } from './client.ts';

export async function setLove(session: session, id: string, remove = false, type?: "artist" | "album" | "song") {
  const endpoint = `${remove ? "un" : ""}star`;

  if (!type) type = "song";

  if (type == "artist") {
    return await request(session, endpoint, { artistId: id });
  }

  if (type == "album") {
    return await request(session, endpoint, { albumId: id });
  }

  return await request(session, endpoint, { id });
}
