import { createMiddleware } from 'hono/factory';
import type { Hono } from 'hono';
import type { Auth } from '../auth/types.js';
import type { Cache } from '../cache/index.js';
import {
  isAuthEnabled,
  isCacheEnabled,
  isLoggingEnabled,
  resolveAuthMountPath,
} from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { ControllerContainer } from '../container/controller-container.js';
import type { RepositoryContainer } from '../container/repository-container.js';
import type { Database } from '../database/types.js';
import type { BackendEnv } from '../middlewares/env.js';

export type WireContextOptions = {
  db: Database | null;
  auth: Auth | null;
  cache: Cache;
  controllers: ControllerContainer;
  repositories: RepositoryContainer;
};

/** Inject services into Hono context and mount auth routes. */
export function wireRequestContext(
  app: Hono<BackendEnv>,
  config: TenoraServerConfig,
  { db, auth, cache, controllers, repositories }: WireContextOptions,
) {
  app.use('*', createMiddleware(async (c, next) => {
    c.set('controllers', controllers);
    c.set('repositories', repositories);
    await next();
  }));

  if (db) {
    app.use('*', createMiddleware(async (c, next) => {
      c.set('db', db);
      await next();
    }));
  }

  if (isAuthEnabled(config) && auth) {
    const authPath = resolveAuthMountPath(config.auth.basePath);

    app.use('*', createMiddleware(async (c, next) => {
      c.set('auth', auth);
      await next();
    }));

    app.all(`${authPath}/*`, (c) => auth.handler(c.req.raw));
  }

  if (isCacheEnabled(config)) {
    app.use('*', createMiddleware(async (c, next) => {
      c.set('cache', cache);
      await next();
    }));
  }

  if (isLoggingEnabled(config)) {
    app.use('*', async (c, next) => {
      const start = Date.now();
      await next();
      console.log(`${c.req.method} ${c.req.path} ${c.res.status} ${Date.now() - start}ms`);
    });
  }
}
