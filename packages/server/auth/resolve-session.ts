import type { Context } from 'hono';
import type { BackendEnv } from '../middlewares/env.js';
import type { AuthSession } from '../middlewares/types.js';
import type { Auth } from './types.js';

export async function resolveAuthSession(c: Context<BackendEnv>): Promise<AuthSession | null> {
  const auth = c.get('auth') as Auth | undefined;
  if (!auth) return null;

  try {
    return await auth.api.getSession({ headers: c.req.raw.headers });
  } catch {
    return null;
  }
}
