import type { Hono } from 'hono';
import { createAuth } from '../../auth/index.js';
import { createHttpApp } from '../../assembly/create-app.js';
import { createCache } from '../../cache/index.js';
import { connectionUrl } from '../../configs/database.js';
import { createControllerContainer } from '../../container/controller-container.js';
import { createRepositoryContainer } from '../../container/repository-container.js';
import { createDatabase } from '../../database/index.js';
import { BaseRepository } from '../../http/base-repository.js';
import {
  getConfig,
  loadConfig,
  type DeepPartial,
} from '../../configs/index.js';
import type { DunetaServerConfig } from '../../configs/types.js';
import type { RequestContext } from '../../middlewares/request-context.js';
import { registerPermissionResolver } from '../../permissions/context.js';
import type { ServerBoot } from './types.js';

let cachedApp: Hono<RequestContext> | undefined;
let cachedAppKey: string | undefined;
let configBootstrapped = false;

function appCacheKey(config: DunetaServerConfig): string {
  return `${connectionUrl(config.database) ?? ''}:${config.auth?.secret ?? ''}`;
}

export function bootstrapConfig(
  boot: ServerBoot,
  overrides?: DeepPartial<DunetaServerConfig>,
): void {
  if (configBootstrapped && !overrides) return;

  const patch: DeepPartial<DunetaServerConfig> = {
    ...boot.config,
    ...overrides,
    runtime: { target: boot.target },
  };

  loadConfig(patch);
  configBootstrapped = true;
}

export async function loadApp(boot: ServerBoot) {
  bootstrapConfig(boot);

  if (boot.resolvePermissions) {
    registerPermissionResolver(boot.resolvePermissions);
  }

  const config = getConfig();
  const cacheKey = appCacheKey(config);

  if (cachedApp && cachedAppKey === cacheKey) return cachedApp;

  const controllers = createControllerContainer();
  const repositories = createRepositoryContainer();
  const db = createDatabase(config);
  BaseRepository.bindDb(db);
  const auth = createAuth(config, db);

  boot.registerServices({ controllers, repositories, db, config });

  const cache = createCache(config.cache);
  const router = boot.createAppRouter(config);

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
