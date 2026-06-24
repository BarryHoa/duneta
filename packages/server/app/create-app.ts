import { Hono } from 'hono';
import type { Auth } from '../auth/index.js';
import { isCsrfEnabled, isRateLimitEnabled } from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { Container } from '../container/index.js';
import type { Database } from '../database/types.js';
import {
  createCorsMiddleware,
  createCsrfMiddleware,
  createErrorHandler,
  createRateLimitMiddleware,
  type BackendEnv,
} from '../middlewares/index.js';
import { registerProviders, resolveCoreProviders } from '../providers/index.js';
import type { TenoraProvider } from '../providers/types.js';
import type { RedisClient } from '../redis/index.js';

export type CreateTenoraAppOptions = {
  router: Hono<BackendEnv>;
  config: TenoraServerConfig;
  db: Database | null;
  auth: Auth | null;
  redis: RedisClient | null;
  container: Container;
  providers?: TenoraProvider[];
};

export async function createTenoraApp({
  router,
  config,
  db,
  auth,
  redis,
  container,
  providers = [],
}: CreateTenoraAppOptions) {
  const app = new Hono<BackendEnv>().basePath('/api');

  app.use('*', createCorsMiddleware());

  if (isRateLimitEnabled(config)) {
    app.use(
      '*',
      createRateLimitMiddleware(config.rateLimit.api.max, config.rateLimit.api.windowMs),
    );
  }

  app.use('*', createCsrfMiddleware(isCsrfEnabled(config)));
  app.onError(createErrorHandler(config.app.debug || config.debug.enabled));

  if (db) container.singleton('db', () => db);
  if (auth) container.singleton('auth', () => auth);
  if (redis) container.singleton('redis', () => redis);
  container.singleton('config', () => config);

  await registerProviders(
    { app, config, container },
    [...resolveCoreProviders(config), ...providers],
  );

  app.route('/', router);
  return app;
}
