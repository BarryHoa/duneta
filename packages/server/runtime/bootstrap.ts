import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Hono } from 'hono';
import { createAuth } from '../auth/index.js';
import { createTenoraApp } from '../app/create-app.js';
import { createCache } from '../cache/index.js';
import { connectionUrl } from '../configs/database.js';
import { createContainer } from '../container/index.js';
import { createDatabase } from '../database/index.js';
import { resolveDatabaseUrl } from '../database/resolve-url.js';
import { getConfig, loadConfig, type DeepPartial } from '../configs/index.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { BackendEnv } from '../middlewares/env.js';
import type { TenoraProvider } from '../providers/types.js';
import type { RuntimeBindings } from './bindings.js';
import { isHyperdriveBinding } from './bindings.js';

let cachedApp: Hono<BackendEnv> | undefined;
let cachedAppKey: string | undefined;
let configBootstrapped = false;

async function loadTenoraConfigFile(): Promise<DeepPartial<TenoraServerConfig>> {
  try {
    const configModule = await import(
      pathToFileURL(join(process.cwd(), 'tenora.config.ts')).href
    );
    return configModule.default ?? {};
  } catch {
    return {};
  }
}

async function loadAppProviders() {
  try {
    return await import(pathToFileURL(join(process.cwd(), 'providers/index.ts')).href);
  } catch {
    return {};
  }
}

function appCacheKey(config: TenoraServerConfig, bindings?: RuntimeBindings): string {
  const dbUrl = resolveDatabaseUrl(config, bindings) ?? connectionUrl(config.database) ?? '';
  const runtime = config.runtime.target;

  if (runtime === 'worker') {
    const hyperdrive = bindings?.HYPERDRIVE;
    const hyperKey = isHyperdriveBinding(hyperdrive) ? hyperdrive.connectionString : '';
    return `worker:${dbUrl}:${hyperKey}`;
  }

  return `node:${dbUrl}`;
}

export async function initConfig(overrides?: DeepPartial<TenoraServerConfig>) {
  if (configBootstrapped && !overrides) return;
  loadConfig(overrides ?? (await loadTenoraConfigFile()));
  configBootstrapped = true;
}

export async function loadApp(bindings?: RuntimeBindings) {
  await initConfig();

  const config = getConfig();
  const cacheKey = appCacheKey(config, bindings);

  if (cachedApp && cachedAppKey === cacheKey) return cachedApp;

  const container = createContainer();
  const db = createDatabase(config, bindings);
  const auth = createAuth(config, db);
  const cache = createCache(config.cache);

  const appModule = await loadAppProviders();
  appModule.registerBindings?.(container, db);

  const routerModule = await import(
    pathToFileURL(join(process.cwd(), 'routers/index.ts')).href
  );

  if (!routerModule.router) {
    throw new Error('routers/index.ts must export `router`.');
  }

  const appProviders: TenoraProvider[] = appModule.providers ?? [];

  cachedApp = await createTenoraApp({
    router: routerModule.router,
    config,
    db,
    auth,
    cache,
    container,
    providers: appProviders,
  });
  cachedAppKey = cacheKey;

  return cachedApp;
}
