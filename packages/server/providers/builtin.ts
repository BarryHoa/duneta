import { createMiddleware } from 'hono/factory';
import type { Auth } from '../auth/types.js';
import {
  isAuthEnabled,
  isCacheEnabled,
  isLoggingEnabled,
  resolveAuthMountPath,
} from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { CacheClient } from '../cache/index.js';
import type { Database } from '../database/types.js';
import type { TenoraProvider } from './types.js';

const containerProvider: TenoraProvider = {
  register(app, _config, container) {
    app.use('*', createMiddleware(async (c, next) => {
      c.set('container', container);
      await next();
    }));
  },
};

const databaseProvider: TenoraProvider = {
  register(app, _config, container) {
    if (!container.has('db')) return;
    const db = container.resolve<Database>('db');
    app.use('*', createMiddleware(async (c, next) => {
      c.set('db', db);
      await next();
    }));
  },
};

const authProvider: TenoraProvider = {
  register(app, config, container) {
    if (!isAuthEnabled(config) || !container.has('auth')) return;

    const auth = container.resolve<Auth>('auth');
    const authPath = resolveAuthMountPath(config.auth.basePath);

    app.use('*', createMiddleware(async (c, next) => {
      c.set('auth', auth);
      await next();
    }));

    app.all(`${authPath}/*`, (c) => auth.handler(c.req.raw));
  },
};

const cacheProvider: TenoraProvider = {
  register(app, config, container) {
    if (!isCacheEnabled(config) || !container.has('cache')) return;
    const cache = container.resolve<CacheClient>('cache');
    app.use('*', createMiddleware(async (c, next) => {
      c.set('cache', cache);
      await next();
    }));
  },
};

const loggingProvider: TenoraProvider = {
  register(app, config) {
    if (!isLoggingEnabled(config)) return;

    app.use('*', async (c, next) => {
      const start = Date.now();
      await next();
      console.log(`${c.req.method} ${c.req.path} ${c.res.status} ${Date.now() - start}ms`);
    });
  },
};

export function resolveCoreProviders(config: TenoraServerConfig): TenoraProvider[] {
  const providers: TenoraProvider[] = [containerProvider];

  if (config.database?.enabled) providers.push(databaseProvider);
  if (isAuthEnabled(config)) providers.push(authProvider);
  if (isCacheEnabled(config)) providers.push(cacheProvider);
  if (isLoggingEnabled(config)) providers.push(loggingProvider);

  return providers;
}
