#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncApi } from '../packages/server/scripts/sync-api.mjs';
import { syncRouters } from '../packages/client/scripts/sync-routers.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = path.join(repoRoot, 'app');
const clientRoot = path.join(repoRoot, 'packages/client');
const serverRoot = path.join(repoRoot, 'packages/server');
const require = createRequire(path.join(repoRoot, 'package.json'));

function bin(pkg, file = 'bin.cjs') {
  return path.join(path.dirname(require.resolve(`${pkg}/package.json`)), file);
}

function wrangler() {
  return path.join(path.dirname(require.resolve('wrangler/package.json')), 'bin/wrangler.js');
}

function run(cmd, args, cwd = repoRoot) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd, env: process.env });
  if (r.error || r.status !== 0) process.exit(r.status ?? 1);
}

function packagesBuilt() {
  return (
    existsSync(path.join(clientRoot, 'dist/components/index.js')) &&
    existsSync(path.join(serverRoot, 'dist/http/index.js'))
  );
}

function buildPackages() {
  if (packagesBuilt()) return;
  console.log('[duneta] building @duneta/client and @duneta/server…');
  run('pnpm', ['--filter', '@duneta/client', '--filter', '@duneta/server', 'run', 'build']);
}

function ensureDevVars() {
  const devVars = path.join(repoRoot, '.dev.vars');
  const example = path.join(repoRoot, '.dev.vars.example');
  if (!existsSync(devVars) && existsSync(example)) {
    copyFileSync(example, devVars);
    console.log('[duneta] created .dev.vars from .dev.vars.example');
  }
}

function loadWebConfig() {
  const tsx = bin('tsx', 'dist/cli.mjs');
  const script = path.join(clientRoot, 'scripts/load-config.mjs');
  const r = spawnSync(process.execPath, [tsx, script, appRoot], { encoding: 'utf8', cwd: appRoot });
  if (r.status !== 0) throw new Error(r.stderr || 'Failed to load duneta.config.ts');
  return JSON.parse(r.stdout);
}

function sync() {
  syncApi(path.join(appRoot, 'api'));
}

function buildWeb() {
  const webConfig = loadWebConfig();
  syncRouters(appRoot, clientRoot, webConfig);
  run(process.execPath, [bin('@react-router/dev'), 'build'], appRoot);
}

function buildAll() {
  buildPackages();
  sync();
  buildWeb();
}

const [command = 'dev', ...rest] = process.argv.slice(2);

switch (command) {
  case 'prepare':
    buildPackages();
    break;
  case 'dev': {
    buildPackages();
    ensureDevVars();
    sync();
    syncRouters(appRoot, clientRoot, loadWebConfig());
    console.log('[duneta] http://localhost:8787 (HMR)');
    run(process.execPath, [bin('@react-router/dev'), 'dev', ...rest], appRoot);
    break;
  }
  case 'deploy':
    buildAll();
    run(process.execPath, [
      wrangler(),
      'deploy',
      '--config',
      path.join(appRoot, 'build/server/wrangler.json'),
      ...rest,
    ]);
    break;
  case 'build':
    buildAll();
    break;
  default:
    console.error(`[duneta] unknown: ${command}`);
    process.exit(1);
}
