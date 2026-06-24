import type { Hono } from 'hono';
import { createAuth } from '../../auth/index.js';
import { createTenoraApp } from '../../app/create-app.js';
import { createCache } from '../../cache/index.js';
import { connectionUrl } from '../../configs/database.js';
import { defaultRegisterBindings } from '../../container/bindings.js';
import { createControllerContainer } from '../../container/controller-container.js';
import { createRepositoryContainer } from '../../container/repository-container.js';
import { createDatabase } from '../../database/index.js';
import { resolveDatabaseUrl } from '../../database/resolve-url.js';
import { getConfig, loadConfig, type DeepPartial } from '../../configs/index.js';
import type { TenoraServerConfig } from '../../configs/types.js';
import type { BackendEnv } from '../../middlewares/env.js';
import { isHyperdriveBinding, type RuntimeBindings } from '../shared/bindings.js';
import type { ServerManifest } from './types.js';

let cachedApp: Hono<BackendEnv> | undefined;
let cachedAppKey: string | undefined;
let configBootstrapped = false;

function appCacheKey(config: TenoraServerConfig, bindings?: RuntimeBindings): string {
  const dbUrl = resolveDatabaseUrl(config, bindings) ?? connectionUrl(config.database) ?? '';
  const hyperdrive = bindings?.HYPERDRIVE;
  const hyperKey = isHyperdriveBinding(hyperdrive) ? hyperdrive.connectionString : '';
  return `${dbUrl}:${hyperKey}`;
}

function initConfig(manifest: ServerManifest, overrides?: DeepPartial<TenoraServerConfig>) {
  if (configBootstrapped && !overrides) return;
  loadConfig(overrides ?? manifest.config);
  configBootstrapped = true;
}

export async function loadApp(manifest: ServerManifest, bindings?: RuntimeBindings) {
  initConfig(manifest);

  const config = getConfig();
  const cacheKey = appCacheKey(config, bindings);

  if (cachedApp && cachedAppKey === cacheKey) return cachedApp;

  const controllers = createControllerContainer();
  const repositories = createRepositoryContainer();
  const db = createDatabase(config, bindings);
  const auth = createAuth(config, db);

  manifest.providers({ controllers, repositories, db, config });

  const cache = createCache(config.cache);
  const router = manifest.createRouter(config);

  cachedApp = createTenoraApp({
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
