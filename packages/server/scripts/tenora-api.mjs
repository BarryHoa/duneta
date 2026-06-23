#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { loadEnvFile } from 'node:process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function requireFromApp(cwd) {
  return createRequire(path.join(cwd, 'package.json'));
}

function resolveAppBin(cwd, packageName, relativePath) {
  const packageJson = requireFromApp(cwd).resolve(`${packageName}/package.json`);
  return path.join(path.dirname(packageJson), relativePath);
}

const [command = 'dev', ...rest] = process.argv.slice(2);
const cwd = process.cwd();

try {
  loadEnvFile(path.join(cwd, '.env'));
} catch {
  // Copy .env.example to .env in this directory.
}

const apiPort = process.env.TENORA_API_PORT ?? 3001;

let executable = process.execPath;
let args;

switch (command) {
  case 'dev':
    console.log(`[tenora-api] API → http://localhost:${apiPort}/api`);
    args = [resolveAppBin(cwd, 'tsx', 'dist/cli.mjs'), 'watch', 'server.ts', ...rest];
    break;
  case 'start':
    console.log(`[tenora-api] starting on :${apiPort}`);
    args = [resolveAppBin(cwd, 'tsx', 'dist/cli.mjs'), 'server.ts', ...rest];
    break;
  case 'dev:cloudflare':
    console.log('[tenora-api] Cloudflare Worker dev');
    args = [resolveAppBin(cwd, 'wrangler', 'bin/wrangler.js'), 'dev', ...rest];
    break;
  case 'deploy:cloudflare':
    args = [resolveAppBin(cwd, 'wrangler', 'bin/wrangler.js'), 'deploy', ...rest];
    break;
  default:
    console.error(`[tenora-api] unknown command: ${command}`);
    process.exit(1);
}

const result = spawnSync(executable, args, {
  stdio: 'inherit',
  cwd,
  env: {
    ...process.env,
    TENORA_SERVER_ROOT: packageRoot,
  },
});

process.exit(result.status ?? 1);
