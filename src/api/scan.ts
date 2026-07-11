import { request } from './client.ts';
import type { session } from './client.ts';

export async function startScan(session: session) {
  return await request(session, "startScan");
}
