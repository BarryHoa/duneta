import type { ExecutionContextLike, ScheduledControllerLike, ServerExport } from './server.js';

/** Cloudflare Workers Assets binding — internal; wired by generated deploy config only. */
const ASSETS_BINDING = 'ASSETS';

export type WebRequestHandler = (request: Request) => Promise<Response>;

export type DunetaWorkerExport = {
  fetch: (request: Request, env: unknown, ctx: ExecutionContextLike) => Promise<Response>;
  scheduled: (
    controller: ScheduledControllerLike,
    env: unknown,
    ctx: ExecutionContextLike,
  ) => Promise<void>;
};

export function createDunetaWorker(
  api: ServerExport,
  web: WebRequestHandler,
): DunetaWorkerExport {
  return {
    async fetch(request: Request, env: unknown) {
      const { pathname } = new URL(request.url);

      if (pathname === '/api' || pathname.startsWith('/api/')) {
        return api.fetch(request);
      }

      const assets = (env as Record<string, { fetch: typeof fetch } | undefined>)[ASSETS_BINDING];
      if (assets) {
        const response = await assets.fetch(request);
        if (response.status !== 404) return response;
      }

      return web(request);
    },
    scheduled: (controller, env, ctx) => api.scheduled(controller, env, ctx),
  };
}
