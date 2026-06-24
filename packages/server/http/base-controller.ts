import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { requirePermissionCheck } from '../permissions/context.js';
import type { Permission, PolicySubject } from '../permissions/types.js';
import { resolveAuthSession } from '../auth/resolve-session.js';
import type { AuthSession } from '../middlewares/types.js';
import type { BackendEnv } from '../middlewares/env.js';

export abstract class BaseController {
  protected json<T>(c: Context<BackendEnv>, data: T, status: ContentfulStatusCode = 200) {
    return c.json(data, status);
  }

  protected notFound(c: Context<BackendEnv>, message = 'Not Found') {
    return c.json({ error: message, code: 'NOT_FOUND' }, 404);
  }

  protected unauthorized(c: Context<BackendEnv>, message = 'Unauthenticated') {
    return c.json({ error: message, code: 'UNAUTHORIZED' }, 401);
  }

  protected forbidden(c: Context<BackendEnv>, message = 'Forbidden') {
    return c.json({ error: message, code: 'FORBIDDEN' }, 403);
  }

  protected userId(c: Context<BackendEnv>) {
    return c.get('userId');
  }

  protected can(c: Context<BackendEnv>, permission: Permission, subject?: PolicySubject) {
    return requirePermissionCheck(c).can(permission, subject);
  }

  protected assertCan(c: Context<BackendEnv>, permission: Permission, subject?: PolicySubject) {
    requirePermissionCheck(c).assert(permission, subject);
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
