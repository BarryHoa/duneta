import { serve } from '@hono/node-server';
import { getConfig } from '../configs/index.js';
import { loadApp } from './bootstrap.js';
import type { RuntimeBindings } from './bindings.js';

export async function bootNodeServer() {
  const app = await loadApp();
  if (getConfig().runtime.target !== 'node') return;

  const { port } = getConfig().app;
  serve({ fetch: app.fetch, port }, () => console.log(`API listening on :${port}`));
}

export async function handleWorkerFetch(
  request: Request,
  env: RuntimeBindings = {},
) {
  const app = await loadApp(env);
  return app.fetch(request, env);
}
