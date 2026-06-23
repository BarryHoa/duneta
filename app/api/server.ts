import { loadEnvFile } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { app } from './app';

const rootEnv = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env');
try {
  loadEnvFile(rootEnv);
} catch {
  // Optional: copy .env.example to .env at the repository root.
}

const port = Number(process.env.TENORA_API_PORT ?? 3001);
serve({ fetch: app.fetch, port }, () => console.log(`API listening on :${port}`));
