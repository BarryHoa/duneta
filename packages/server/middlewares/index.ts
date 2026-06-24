import { createMiddleware } from 'hono/factory';
import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { TenoraServerConfig } from '../configs/types.js';
import { requireAuth } from './auth.js';
import type { BackendEnv } from './env.js';
import { createLocaleMiddleware } from './locale.js';
import { createTimezoneMiddleware } from './timezone.js';

export type { BackendEnv } from './env.js';

export { createLocaleMiddleware, createTimezoneMiddleware, requireAuth };
export type { AuthSession, AuthUser } from './types.js';

export function createContextDefaultsMiddleware(config: TenoraServerConfig) {
  return createMiddleware<BackendEnv>(async (c, next) => {
    c.set('locale', config.locale.default);
    c.set('timezone', config.timezone.default);
    await next();
  });
}

export function createCorsMiddleware(origins: string[] = ['*']) {
  return createMiddleware<BackendEnv>(async (c, next) => {
    const origin = c.req.header('Origin') ?? '*';
    const allowed = origins.includes('*') || origins.includes(origin);

    if (allowed) {
      c.header('Access-Control-Allow-Origin', origins.includes('*') ? '*' : origin);
      c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      c.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Accept-Language, X-Tenora-Timezone, X-Tenora-Locale',
      );
      c.header('Access-Control-Allow-Credentials', 'true');
    }

    if (c.req.method === 'OPTIONS') {
      return c.body(null, 204);
    }

    await next();
  });
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function createRateLimitMiddleware(max: number, windowMs: number) {
  return createMiddleware<BackendEnv>(async (c, next) => {
    const key = c.req.header('x-forwarded-for') ?? c.req.header('cf-connecting-ip') ?? 'local';
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || entry.resetAt <= now) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    if (entry.count >= max) {
      return c.json({ error: 'Too many requests' }, 429);
    }

    entry.count += 1;
    await next();
  });
}

export function createCsrfMiddleware(enabled: boolean) {
  return createMiddleware<BackendEnv>(async (c, next) => {
    if (!enabled) {
      await next();
      return;
    }

    // Stub: full CSRF validation ships in a later phase.
    await next();
  });
}

export function createErrorHandler(debug: boolean) {
  return (error: Error, c: Context<BackendEnv>) => {
    console.error(error);
    const status = ('status' in error ? Number(error.status) : 500) as ContentfulStatusCode;
    const message = debug ? error.message : 'Internal Server Error';
    return c.json({ error: message }, status >= 400 && status < 600 ? status : 500);
  };
}
