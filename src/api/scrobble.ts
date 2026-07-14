import { request } from './client.ts';
import type { session } from './client.ts';

export async function sendNowPlaying(session: session, id: string) {
  console.warn("Audio: sent now playing for", id);
  return await request(session, "scrobble", { id, submission: false });
}
export async function scrobble(session: session, id: string, time: number) {
  console.warn("Audio: sent scrobble for", id, time);
  return await request(session, "scrobble", { id, time, submission: true });
}
