import type { Hono } from 'hono';
import { createAuth } from '../../auth/index.js';
import { createHttpApp } from '../../assembly/create-app.js';
import { createCache } from '../../cache/index.js';
import { connectionUrl } from '../../configs/database.js';
import { createControllerContainer } from '../../container/controller-container.js';
import { createRepositoryContainer } from '../../container/repository-container.js';
import { createDatabase } from '../../database/index.js';
import { resolveDatabaseUrl } from '../../database/resolve-url.js';
import {
  getConfig,
  loadConfig,
  type DeepPartial,
} from '../../configs/index.js';
import type { TenoraServerConfig } from '../../configs/types.js';
import type { RequestContext } from '../../middlewares/request-context.js';
import { registerPermissionResolver } from '../../permissions/context.js';
import { isHyperdriveBinding, type PlatformEnv } from './platform-env.js';
import type { ServerBoot } from './types.js';

let cachedApp: Hono<RequestContext> | undefined;
let cachedAppKey: string | undefined;
let configBootstrapped = false;

function appCacheKey(config: TenoraServerConfig, platform?: PlatformEnv): string {
  const dbUrl =
    resolveDatabaseUrl(config, platform) ??
    connectionUrl(config.database) ??
    '';
  const hyperdrive = platform?.HYPERDRIVE;
  const hyperKey = isHyperdriveBinding(hyperdrive) ? hyperdrive.connectionString : '';
  return `${dbUrl}:${hyperKey}`;
}

export function bootstrapConfig(
  boot: ServerBoot,
  overrides?: DeepPartial<TenoraServerConfig>,
): void {
  if (configBootstrapped && !overrides) return;

  const patch: DeepPartial<TenoraServerConfig> = {
    ...boot.config,
    ...overrides,
    runtime: { target: boot.target },
  };

  if (boot.target === 'node' && boot.config.app?.debug === undefined) {
    patch.app = { ...patch.app, debug: true };
  }

  loadConfig(patch);
  configBootstrapped = true;
}

export async function loadApp(boot: ServerBoot, platform?: PlatformEnv) {
  bootstrapConfig(boot);

  if (boot.resolvePermissions) {
    registerPermissionResolver(boot.resolvePermissions);
  }

  const config = getConfig();
  const cacheKey = appCacheKey(config, platform);

  if (cachedApp && cachedAppKey === cacheKey) return cachedApp;

  const controllers = createControllerContainer();
  const repositories = createRepositoryContainer();
  const db = createDatabase(config, platform);
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
