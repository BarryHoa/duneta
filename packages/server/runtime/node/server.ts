import { getConfig } from '../../configs/index.js';
import { defaultRegisterBindings } from '../../container/bindings.js';
import { bootstrapConfig, loadApp } from '../shared/boot.js';
import { toManifest, type ServerOptions } from '../shared/types.js';

export type { ServerOptions, ServerManifest } from '../shared/types.js';
export type { BindingContext, RegisterBindings } from '../../container/index.js';

export type ServerExport = {
  port: number;
  fetch: (request: Request) => Promise<Response>;
};

/** Bun / VPS — `export default defineServer({...})` in `server.node.ts`. */
export function defineServer(options: ServerOptions): ServerExport {
  const manifest = toManifest(options, 'node', defaultRegisterBindings);
  bootstrapConfig(manifest);

  return {
    port: getConfig().app.port,
    fetch: (request) => loadApp(manifest).then((app) => app.fetch(request)),
  };
}
