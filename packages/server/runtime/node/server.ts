import { getConfig } from '../../configs/index.js';
import { bootstrapConfig, loadApp } from '../shared/boot.js';
import { createServerBoot, type ServerOptions } from '../shared/types.js';

export type { ServerOptions, ServerBoot } from '../shared/types.js';
export type { RegisterServices, ServiceRegistryContext } from '../../container/index.js';

export type ServerExport = {
  port: number;
  fetch: (request: Request) => Promise<Response>;
};

/** Bun / VPS — `export default defineServer({...})` in `server.node.ts`. */
export function defineServer(options: ServerOptions): ServerExport {
  const boot = createServerBoot(options, 'node');
  bootstrapConfig(boot);

  return {
    port: getConfig().app.port,
    fetch: (request) => loadApp(boot).then((app) => app.fetch(request)),
  };
}
