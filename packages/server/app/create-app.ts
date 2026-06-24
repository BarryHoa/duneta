import { Hono } from 'hono';
import type { Auth } from '../auth/types.js';
import { bindCached } from '../cached/index.js';
import type { Cache } from '../cache/index.js';
import { isCsrfEnabled, isCacheEnabled, isRateLimitEnabled } from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { ControllerContainer } from '../container/controller-container.js';
import type { RepositoryContainer } from '../container/repository-container.js';
import type { Database } from '../database/types.js';
import {
  createContextDefaultsMiddleware,
  createCoreMiddleware,
  createCorsMiddleware,
  createCsrfMiddleware,
  createErrorHandler,
  createRateLimitMiddleware,
  type BackendEnv,
} from '../middlewares/index.js';
import { wireRequestContext } from './wire-context.js';

export type CreateTenoraAppOptions = {
  router: Hono<BackendEnv>;
  config: TenoraServerConfig;
  db: Database | null;
  auth: Auth | null;
  cache: Cache;
  controllers: ControllerContainer;
  repositories: RepositoryContainer;
};

export function createTenoraApp({
  router,
  config,
  db,
  auth,
  cache,
  controllers,
  repositories,
}: CreateTenoraAppOptions) {
  const app = new Hono<BackendEnv>().basePath('/api');

  app.use('*', createCorsMiddleware());
  app.use('*', createContextDefaultsMiddleware(config));
  app.use('*', createCoreMiddleware(config));

  if (isRateLimitEnabled(config)) {
    app.use('*', createRateLimitMiddleware(config.security.rateLimit, isCacheEnabled(config) ? cache : null));
  }

  if (isCsrfEnabled(config)) {
    app.use('*', createCsrfMiddleware(config));
  }

  app.onError(createErrorHandler(config.app.debug || config.debug.enabled));

  bindCached(cache);

  wireRequestContext(app, config, { db, auth, cache, controllers, repositories });

  app.route('/', router);
  return app;
}
