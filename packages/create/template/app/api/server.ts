import { loadEnvFile } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { getServiceStatus } from '@tenora/server/services';
import { Hono } from 'hono';

const rootEnv = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env');
try {
  loadEnvFile(rootEnv);
} catch {
  // Optional: copy .env.example to .env at the project root.
}

const app = new Hono();
app.get('/api/health', (c) => c.json(getServiceStatus()));

serve({ fetch: app.fetch, port: Number(process.env.TENORA_API_PORT ?? 3001) });
