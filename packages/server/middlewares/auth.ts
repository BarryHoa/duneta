import { createMiddleware } from 'hono/factory';
import { resolveAuthSession } from '../auth/resolve-session.js';
import type { BackendEnv } from './env.js';

export function requireAuth() {
  return createMiddleware<BackendEnv>(async (c, next) => {
    const session = await resolveAuthSession(c);
    if (!session?.user) {
      return c.json({ error: 'Unauthenticated' }, 401);
    }

    c.set('userId', session.user.id);
    await next();
  });
}
