import { Hono } from 'hono';
import type { BackendEnv } from '@tenora/server/middlewares';
import { router } from './routers';

export const app = new Hono<BackendEnv>().basePath('/api');
app.route('/', router);
