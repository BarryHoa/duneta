import { serve } from '@hono/node-server';
import { getServiceStatus } from '@tenora/server/services';
import { Hono } from 'hono';

const app = new Hono();
app.get('/api/health', (c) => c.json(getServiceStatus()));

serve({ fetch: app.fetch, port: Number(process.env.PORT ?? 3001) });
