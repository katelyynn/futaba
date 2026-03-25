import { request, session } from './client';

export async function sendNowPlaying(session: session, id: string) {
  console.log("nowPlaying", id);
  return await request(session, "scrobble", { id, submission: false });
}
export async function scrobble(session: session, id: string, time: number) {
  console.log("scrobble", id, time);
  return await request(session, "scrobble", { id, time, submission: true });
}