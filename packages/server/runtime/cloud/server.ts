import { loadApp } from '../shared/boot.js';
import type { RuntimeBindings } from '../shared/bindings.js';
import { defaultRegisterBindings } from '../../container/bindings.js';
import { toManifest, type ServerOptions } from '../shared/types.js';

export type { ServerOptions, ServerManifest } from '../shared/types.js';
export type { BindingContext, RegisterBindings } from '../../container/index.js';

export type ServerExport = {
  fetch: (request: Request, env?: RuntimeBindings) => Promise<Response>;
};

/** Cloudflare Worker / Vercel edge — `export default defineServer({...})` in `server.ts`. */
export function defineServer(options: ServerOptions): ServerExport {
  const manifest = toManifest(options, defaultRegisterBindings);

  return {
    fetch: (request, env = {}) =>
      loadApp(manifest, env).then((app) => app.fetch(request, env)),
  };
}
