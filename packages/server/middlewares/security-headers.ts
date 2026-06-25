import { createMiddleware } from 'hono/factory';
import type { TenoraServerConfig } from '../configs/types.js';
import type { RequestContext } from './request-context.js';

export function createSecurityHeadersMiddleware(config: TenoraServerConfig) {
  const headers = config.headers;

  return createMiddleware<RequestContext>(async (c, next) => {
    c.header('X-Frame-Options', headers.frameOptions);

    if (headers.contentTypeOptions) {
      c.header('X-Content-Type-Options', 'nosniff');
    }

    c.header('Referrer-Policy', headers.referrerPolicy);
    c.header('Permissions-Policy', headers.permissionsPolicy);
    await next();
  });
}
