import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { resolveAuthSession } from '../auth/resolve-session.js';
import type { AuthSession } from '../middlewares/types.js';
import type { BackendEnv } from '../middlewares/env.js';

export abstract class BaseController {
  protected json<T>(c: Context<BackendEnv>, data: T, status: ContentfulStatusCode = 200) {
    return c.json(data, status);
  }

  protected notFound(c: Context<BackendEnv>, message = 'Not Found') {
    return c.json({ error: message }, 404);
  }

  protected unauthorized(c: Context<BackendEnv>, message = 'Unauthenticated') {
    return c.json({ error: message }, 401);
  }

  protected userId(c: Context<BackendEnv>): string | undefined {
    return c.get('userId');
  }

  protected async resolveSession(c: Context<BackendEnv>): Promise<AuthSession | null> {
    return resolveAuthSession(c);
  }

  protected locale(c: Context<BackendEnv>): string {
    return c.get('locale');
  }

  protected timezone(c: Context<BackendEnv>): string {
    return c.get('timezone');
  }

  protected requestId(c: Context<BackendEnv>): string {
    return c.get('requestId');
  }
}
