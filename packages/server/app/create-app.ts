import { Hono } from 'hono';
import type { BackendEnv } from '../middlewares/index.js';

export function createTenoraApp(router: Hono<BackendEnv>) {
  const app = new Hono<BackendEnv>().basePath('/api');
  app.route('/', router);
  return app;
}
