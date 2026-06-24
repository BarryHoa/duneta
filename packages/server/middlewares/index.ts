import { createMiddleware } from 'hono/factory';
import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { TenoraServerConfig } from '../configs/types.js';
import { requireAuth } from './auth.js';
import { createCsrfMiddleware } from './csrf.js';
import type { BackendEnv } from './env.js';
import { createLocaleMiddleware } from './locale.js';
import { createRateLimitMiddleware } from './rate-limit.js';
import { createRequestIdMiddleware } from './request-id.js';
import { createSecurityHeadersMiddleware } from './security-headers.js';
import { createTimezoneMiddleware } from './timezone.js';

export type { BackendEnv } from './env.js';

export {
  createCoreMiddleware,
  createRequestContextMiddleware,
} from '../examples/middleware.js';
export {
  createCsrfMiddleware,
  createLocaleMiddleware,
  createRateLimitMiddleware,
  createRequestIdMiddleware,
  createSecurityHeadersMiddleware,
  createTimezoneMiddleware,
  requireAuth,
};
export type { AuthSession, AuthUser } from './types.js';

export function createContextDefaultsMiddleware(config: TenoraServerConfig) {
  return createMiddleware<BackendEnv>(async (c, next) => {
    c.set('requestId', '');
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
        'Content-Type, Authorization, Accept-Language, X-Tenora-Timezone, X-Tenora-Locale, X-Request-Id, X-CSRF-Token',
      );
      c.header('Access-Control-Expose-Headers', 'X-Request-Id, Content-Language, X-Tenora-Timezone');
      c.header('Access-Control-Allow-Credentials', 'true');
    }

    if (c.req.method === 'OPTIONS') {
      return c.body(null, 204);
    }

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
