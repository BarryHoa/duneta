import { loadApp } from '../shared/boot.js';
import { createServerBoot, type ServerOptions } from '../shared/types.js';

export type { ServerOptions, ServerBoot } from '../shared/types.js';
export type { RegisterServices, ServiceRegistryContext } from '../../container/index.js';

export type ServerExport = {
  fetch: (request: Request) => Promise<Response>;
};

/** Cloudflare Worker — `export default defineServer({...})` in `worker.ts`. */
export function defineServer(options: ServerOptions): ServerExport {
  const boot = createServerBoot(options, 'worker');

  return {
    fetch: (request) => loadApp(boot).then((app) => app.fetch(request)),
  };
}
