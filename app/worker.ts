import { createRequestHandler, RouterContextProvider } from 'react-router';
import { defineServer } from '@duneta/server/runtime/worker';
import { api as apiConfig } from './duneta.config';
import { createAppRouter } from './api/router';
import { resolvePermissions } from './api/permissions';
import { registerServices } from './api/services';

const api = defineServer({
  config: apiConfig,
  createAppRouter,
  registerServices,
  resolvePermissions,
});

const web = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.PROD ? 'production' : import.meta.env.MODE,
);

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
