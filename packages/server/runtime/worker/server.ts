import { loadApp } from '../shared/boot.js';
import {
  createServerBoot,
  type ServerBoot,
  type ServerOptions,
} from '../shared/types.js';
import { bridgeWorkerEnv, type WorkerEnv } from './env.js';

export type { ServerOptions, ServerBoot } from '../shared/types.js';
export type { RegisterServices, ServiceRegistryContext } from '../../container/index.js';
export type { WorkerEnv } from './env.js';
export { bridgeWorkerEnv } from './env.js';

export type ServerExport = {
  fetch: (request: Request, env?: WorkerEnv) => Promise<Response>;
};

async function resolveConfigPatch(
  options: ServerOptions,
  env?: WorkerEnv,
): Promise<NonNullable<ServerOptions['config']>> {
  if (env) bridgeWorkerEnv(env);
  if (options.loadConfig) return options.loadConfig();
  if (options.config) return options.config;
  throw new Error('defineServer requires `loadConfig` or `config`.');
}

/** Cloudflare Worker — lazy-load `duneta.server.config.ts` via `loadConfig`. */
export function defineServer(options: ServerOptions): ServerExport {
  let bootPromise: Promise<ServerBoot> | undefined;

  function ensureBoot(env?: WorkerEnv): Promise<ServerBoot> {
    if (!bootPromise) {
      bootPromise = resolveConfigPatch(options, env).then((config) =>
        createServerBoot({ ...options, config }, 'worker'),
      );
    }
    return bootPromise;
  }

  return {
    fetch: (request, env) =>
      ensureBoot(env).then((boot) => loadApp(boot)).then((app) => app.fetch(request)),
  };
}
