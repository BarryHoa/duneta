import { loadApp } from '../shared/boot.js';
import type { PlatformEnv } from '../shared/platform-env.js';
import { createServerBoot, type ServerOptions } from '../shared/types.js';

export type { ServerOptions, ServerBoot } from '../shared/types.js';
export type { RegisterServices, ServiceRegistryContext } from '../../container/index.js';

export type ServerExport = {
  fetch: (request: Request, env?: PlatformEnv) => Promise<Response>;
};

/** Cloudflare Worker — `export default defineServer({...})` in `server.ts`. */
export function defineServer(options: ServerOptions): ServerExport {
  const boot = createServerBoot(options, 'worker');

  return {
    fetch: (request, env = {}) =>
      loadApp(boot, env).then((app) => app.fetch(request, env)),
  };
}
