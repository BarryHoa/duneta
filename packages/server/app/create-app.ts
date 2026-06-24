import { Hono } from 'hono';
import type { Auth } from '../auth/types.js';
import type { CacheClient } from '../cache/index.js';
import { isCsrfEnabled, isRateLimitEnabled } from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { Container } from '../container/index.js';
import type { Database } from '../database/types.js';
import { createRequestContextMiddleware } from '../examples/middleware.js';
import {
  createContextDefaultsMiddleware,
  createCorsMiddleware,
  createCsrfMiddleware,
  createErrorHandler,
  createRateLimitMiddleware,
  type BackendEnv,
} from '../middlewares/index.js';
import { registerProviders, resolveCoreProviders } from '../providers/index.js';
import type { TenoraProvider } from '../providers/types.js';

export type CreateTenoraAppOptions = {
  router: Hono<BackendEnv>;
  config: TenoraServerConfig;
  db: Database | null;
  auth: Auth | null;
  cache: CacheClient | null;
  container: Container;
  providers?: TenoraProvider[];
};

export async function createTenoraApp({
  router,
  config,
  db,
  auth,
  cache,
  container,
  providers = [],
}: CreateTenoraAppOptions) {
  const app = new Hono<BackendEnv>().basePath('/api');

  app.use('*', createCorsMiddleware());
  app.use('*', createContextDefaultsMiddleware(config));
  app.use('*', createRequestContextMiddleware(config));

  if (isRateLimitEnabled(config)) {
    const { api } = config.security.rateLimit;
    app.use('*', createRateLimitMiddleware(api.max, api.windowMs));
  }

  app.use('*', createCsrfMiddleware(isCsrfEnabled(config)));
  app.onError(createErrorHandler(config.app.debug || config.debug.enabled));

  if (db) container.singleton('db', () => db);
  if (auth) container.singleton('auth', () => auth);
  if (cache) container.singleton('cache', () => cache);
  container.singleton('config', () => config);

  await registerProviders(
    { app, config, container },
    [...resolveCoreProviders(config), ...providers],
  );

  app.route('/', router);
  return app;
}
