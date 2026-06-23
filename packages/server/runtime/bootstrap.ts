import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Hono } from 'hono';
import { createTenoraApp } from '../app/create-app.js';
import { loadConfig, type DeepPartial } from '../configs/index.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { BackendEnv } from '../middlewares/index.js';

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

export async function initConfig(overrides?: DeepPartial<TenoraServerConfig>) {
  if (configBootstrapped && !overrides) return;

  loadConfig(overrides ?? (await loadTenoraConfigFile()));
  configBootstrapped = true;
}

export async function loadApp() {
  if (cachedApp) return cachedApp;

  await initConfig();

  const routerModule = await import(
    pathToFileURL(join(process.cwd(), 'routers/index.ts')).href
  );

  if (!routerModule.router) {
    throw new Error('routers/index.ts must export `router`.');
  }

  cachedApp = createTenoraApp(routerModule.router);
  return cachedApp;
}
