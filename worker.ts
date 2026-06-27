import { createRequestHandler, RouterContextProvider } from 'react-router';
import { defineServer } from '@duneta/server/runtime/worker';
import { loadWorkerServerConfig } from '@duneta/client/configs';
import { createAppRouter } from './app/api/router';
import { resolvePermissions } from './app/api/permissions';
import { registerServices } from './app/api/services';

const api = defineServer({
  loadConfig: () => loadWorkerServerConfig(() => import('./duneta.server.config')),
  createAppRouter,
  registerServices,
  resolvePermissions,
});

const web = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.PROD ? 'production' : import.meta.env.MODE,
);

/** Wrangler bindings — secrets via `process.env` at runtime (nodejs_compat_populate_process_env). */
type Env = {
  ASSETS?: { fetch: typeof fetch };
  [key: string]: unknown;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return api.fetch(request, env);
    }

    if (env.ASSETS) {
      const assets = await env.ASSETS.fetch(request);
      if (assets.status !== 404) return assets;
    }

    return web(request, new RouterContextProvider());
  },
} satisfies ExportedHandler<Env>;
