#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const projectRoot = process.cwd();
const appRoot = path.join(projectRoot, 'app');

const clientRoot = path.dirname(require.resolve('@duneta/client/package.json'));
const serverRoot = path.dirname(require.resolve('@duneta/server/package.json'));

function bin(pkg, file = 'bin.cjs') {
  return path.join(path.dirname(require.resolve(`${pkg}/package.json`)), file);
}

function wrangler() {
  return path.join(path.dirname(require.resolve('wrangler/package.json')), 'bin/wrangler.js');
}

function run(cmd, args, cwd = projectRoot) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd, env: process.env });
  if (r.error || r.status !== 0) process.exit(r.status ?? 1);
}

function packagesBuilt() {
  return (
    existsSync(path.join(clientRoot, 'dist/components/index.js')) &&
    existsSync(path.join(serverRoot, 'dist/http/index.js'))
  );
}

function findMonorepoRoot() {
  let dir = projectRoot;
  while (dir !== path.dirname(dir)) {
    if (existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

function buildPackagesIfNeeded() {
  if (packagesBuilt()) return;
  const monorepoRoot = findMonorepoRoot();
  if (!monorepoRoot) {
    console.error('[duneta] @duneta/client or @duneta/server is not built. Reinstall duneta.');
    process.exit(1);
  }
  console.log('[duneta] building @duneta/client and @duneta/server…');
  run('pnpm', ['--filter', '@duneta/client', '--filter', '@duneta/server', 'run', 'build'], monorepoRoot);
}

function ensureDevVars() {
  const devVars = path.join(projectRoot, '.dev.vars');
  const example = path.join(projectRoot, '.dev.vars.example');
  if (!existsSync(devVars) && existsSync(example)) {
    copyFileSync(example, devVars);
    console.log('[duneta] created .dev.vars from .dev.vars.example');
  }
}

async function loadSyncRouters() {
  const mod = await import('@duneta/client/scripts/sync-routers');
  return mod.syncRouters;
}

async function loadSyncApi() {
  const mod = await import('@duneta/server/scripts/sync-api');
  return mod.syncApi;
}

function loadWebConfig() {
  const script = path.join(clientRoot, 'scripts/load-config.mjs');
  const tsx = bin('tsx', 'dist/cli.mjs');
  const r = spawnSync(process.execPath, [tsx, script, projectRoot], {
    encoding: 'utf8',
    cwd: projectRoot,
  });
  if (r.status !== 0) throw new Error(r.stderr || 'Failed to load duneta.config.ts');
  return JSON.parse(r.stdout);
}

async function sync() {
  const syncApi = await loadSyncApi();
  syncApi(path.join(appRoot, 'api'));
}

async function buildWeb() {
  const syncRouters = await loadSyncRouters();
  const webConfig = loadWebConfig();
  syncRouters(appRoot, clientRoot, webConfig);
  run(process.execPath, [bin('@react-router/dev'), 'build'], projectRoot);
}

async function buildAll() {
  buildPackagesIfNeeded();
  await sync();
  await buildWeb();
}

const [command = 'dev', ...rest] = process.argv.slice(2);

try {
  switch (command) {
    case 'prepare':
      buildPackagesIfNeeded();
      break;
    case 'dev': {
      buildPackagesIfNeeded();
      ensureDevVars();
      await sync();
      const syncRouters = await loadSyncRouters();
      syncRouters(appRoot, clientRoot, loadWebConfig());
      console.log('[duneta] http://localhost:8787 (HMR)');
      run(process.execPath, [bin('@react-router/dev'), 'dev', ...rest], projectRoot);
      break;
    }
    case 'deploy':
      await buildAll();
      run(
        process.execPath,
        [
          wrangler(),
          'deploy',
          '--config',
          path.join(appRoot, 'build/server/wrangler.json'),
          ...rest,
        ],
        projectRoot,
      );
      break;
    case 'build':
      await buildAll();
      break;
    default:
      console.error(`[duneta] unknown command: ${command}`);
      console.error('[duneta] usage: duneta <dev|build|deploy|prepare>');
      process.exit(1);
  }
} catch (error) {
  console.error(`[duneta] ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
