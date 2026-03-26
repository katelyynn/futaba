import { request, session } from './client';

export async function startScan(session: session) {
  return await request(session, "startScan");
}