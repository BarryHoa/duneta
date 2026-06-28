import type { Hono } from 'hono';
import { createAuth } from '../../auth/index.js';
import { createHttpApp } from '../../assembly/create-app.js';
import { createCache } from '../../cache/index.js';
import { connectionUrl } from '../../configs/database.js';
import { createControllerContainer } from '../../container/controller-container.js';
import { createRepositoryContainer } from '../../container/repository-container.js';
import { createDatabase } from '../../database/index.js';
import { BaseRepository } from '../../http/base-repository.js';
import { getConfig } from '../../configs/index.js';
import type { DunetaServerConfig } from '../../configs/types.js';
import type { RequestContext } from '../../middlewares/request-context.js';
import { registerPermissionResolver } from '../../permissions/context.js';
import { resolveServerHandlers, type ServerOptions } from './types.js';

let cachedApp: Hono<RequestContext> | undefined;
let cachedAppKey: string | undefined;

function appCacheKey(config: DunetaServerConfig): string {
  return `${connectionUrl(config.database) ?? ''}:${config.auth?.secret ?? ''}`;
}

export async function loadApp(options: ServerOptions) {
  const handlers = resolveServerHandlers(options);

  if (handlers.resolvePermissions) {
    registerPermissionResolver(handlers.resolvePermissions);
  }

  const config = getConfig();
  const cacheKey = appCacheKey(config);

  if (cachedApp && cachedAppKey === cacheKey) return cachedApp;

  const controllers = createControllerContainer();
  const repositories = createRepositoryContainer();
  const db = createDatabase(config);
  BaseRepository.bindDb(db);
  const auth = createAuth(config, db);

  handlers.registerServices({ controllers, repositories, db, config });

  const cache = createCache(config.cache);
  const router = handlers.createAppRouter(config);

  cachedApp = createHttpApp({
    router,
    config,
    db,
    auth,
    cache,
    controllers,
    repositories,
  });
  cachedAppKey = cacheKey;

  return cachedApp;
}
