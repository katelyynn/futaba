import { request } from './client.ts';
import type { session } from './client.ts';
import { note } from "@/api/log.ts";

export async function sendNowPlaying(session: session, id: string) {
  note(`Sent now playing for ${id}`, 'scrobble');
  return await request(session, "scrobble", { id, submission: false });
}
export async function scrobble(session: session, id: string, time: number) {
  note(`Sent scrobble for ${id} with time ${time}`, 'scrobble');
  return await request(session, "scrobble", { id, time, submission: true });
}
