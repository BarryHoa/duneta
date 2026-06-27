import { createRequestHandler, RouterContextProvider } from 'react-router';
import { defineServer } from '@duneta/server/runtime/worker';
import { toServerConfig } from '@duneta/client/configs/duneta';
import dunetaConfig from './duneta.config';
import { createAppRouter } from './app/api/router';
import { resolvePermissions } from './app/api/permissions';
import { registerServices } from './app/api/services';

const api = defineServer({
  config: toServerConfig(dunetaConfig),
  createAppRouter,
  registerServices,
  resolvePermissions,
});

const web = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.PROD ? 'production' : import.meta.env.MODE,
);

type Env = {
  ASSETS?: { fetch: typeof fetch };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return api.fetch(request);
    }

    if (env.ASSETS) {
      const assets = await env.ASSETS.fetch(request);
      if (assets.status !== 404) return assets;
    }

    return web(request, new RouterContextProvider());
  },
} satisfies ExportedHandler<Env>;
