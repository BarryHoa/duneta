import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Hono } from 'hono';
import { createAuth } from '../auth/index.js';
import { createTenoraApp } from '../app/create-app.js';
import { createCache } from '../cache/index.js';
import { createContainer } from '../container/index.js';
import { createDatabase } from '../database/index.js';
import { getConfig, loadConfig, type DeepPartial } from '../configs/index.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { BackendEnv } from '../middlewares/index.js';
import type { TenoraProvider } from '../providers/types.js';

let cachedApp: Hono<BackendEnv> | undefined;
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

export async function initConfig(overrides?: DeepPartial<TenoraServerConfig>) {
  if (configBootstrapped && !overrides) return;
  loadConfig(overrides ?? (await loadTenoraConfigFile()));
  configBootstrapped = true;
}

export async function loadApp() {
  if (cachedApp) return cachedApp;

  await initConfig();

  const config = getConfig();
  const container = createContainer();
  const db = createDatabase(config);
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

  return cachedApp;
}
