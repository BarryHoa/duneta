import './load-env.js';
import { serve } from '@hono/node-server';
import { app } from './app';

const port = Number(process.env.TENORA_API_PORT ?? 3001);
serve({ fetch: app.fetch, port }, () => console.log(`API listening on :${port}`));
