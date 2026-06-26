#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncApi } from './sync-api.mjs';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(packageRoot, '../..');

function requireFromApp(cwd) {
  return createRequire(path.join(cwd, 'package.json'));
}

function resolveAppBin(cwd, packageName, relativePath) {
  const packageJson = requireFromApp(cwd).resolve(`${packageName}/package.json`);
  return path.join(path.dirname(packageJson), relativePath);
}

function resolveCloudEntry(cwd) {
  const entry = path.join(cwd, 'server.ts');
  if (existsSync(entry)) return entry;

  console.error('[duneta-api] Missing server.ts — create app/api/server.ts');
  process.exit(1);
}

function resolveNodeEntry(cwd) {
  const entry = path.join(cwd, 'server.node.ts');
  if (existsSync(entry)) return entry;

  console.error('[duneta-api] Missing server.node.ts — create app/api/server.node.ts');
  process.exit(1);
}

/** pnpm hoists deps to repo root — Bun resolves from `packages/server`. */
function linkServerDepsForBun() {
  const serverNm = path.join(packageRoot, 'node_modules');
  const rootNm = path.join(repoRoot, 'node_modules');
  const deps = Object.keys(
    JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8')).dependencies ?? {},
  );

  mkdirSync(serverNm, { recursive: true });

  for (const name of deps) {
    const src = name.startsWith('@')
      ? path.join(rootNm, name.split('/')[0], name.split('/')[1])
      : path.join(rootNm, name);
    const dest = name.startsWith('@')
      ? path.join(serverNm, name.split('/')[0], name.split('/')[1])
      : path.join(serverNm, name);

    if (!existsSync(src) || src === dest) continue;

    mkdirSync(path.dirname(dest), { recursive: true });
    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    symlinkSync(src, dest);
  }
}

const [command = 'dev', ...rest] = process.argv.slice(2);
const cwd = process.cwd();

try {
  loadEnvFile(path.join(cwd, '.env'));
} catch {
  // Copy .env.example to .env in this directory.
}

const SYNC_COMMANDS = new Set(['dev', 'deploy', 'dev:node', 'start:node', 'sync']);

if (SYNC_COMMANDS.has(command)) {
  syncApi(cwd);
  if (command === 'sync') {
    console.log('[duneta-api] sync complete');
    process.exit(0);
  }
}

const wrangler = resolveAppBin(cwd, 'wrangler', 'bin/wrangler.js');

let executable = process.execPath;
let args;

switch (command) {
  case 'dev':
    console.log('[duneta-api] Cloud dev (Wrangler) → http://localhost:8787/api');
    args = [wrangler, 'dev', resolveCloudEntry(cwd), ...rest];
    break;
  case 'deploy':
    console.log('[duneta-api] Cloud deploy (Wrangler)');
    args = [wrangler, 'deploy', resolveCloudEntry(cwd), ...rest];
    break;
  case 'dev:node':
    linkServerDepsForBun();
    console.log('[duneta-api] Bun dev → http://localhost:3001/api');
    executable = 'bun';
    args = ['--watch', resolveNodeEntry(cwd), ...rest];
    break;
  case 'start:node':
    linkServerDepsForBun();
    console.log('[duneta-api] Bun start');
    executable = 'bun';
    args = [resolveNodeEntry(cwd), ...rest];
    break;
  default:
    console.error(`[duneta-api] unknown command: ${command}`);
    process.exit(1);
}

const result = spawnSync(executable, args, {
  stdio: 'inherit',
  cwd,
  env: process.env,
});

process.exit(result.status ?? 1);
