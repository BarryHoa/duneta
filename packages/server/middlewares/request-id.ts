import { createMiddleware } from 'hono/factory';
import type { TenoraServerConfig } from '../configs/types.js';
import type { BackendEnv } from './env.js';

export function createRequestIdMiddleware(config: TenoraServerConfig) {
  const { header } = config.request.id;

  return createMiddleware<BackendEnv>(async (c, next) => {
    const incoming = c.req.header(header)?.trim();
    const requestId = incoming && incoming.length > 0 ? incoming : crypto.randomUUID();

    c.set('requestId', requestId);
    c.header(header, requestId);
    await next();
  });
}
