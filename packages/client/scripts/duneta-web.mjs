#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { loadEnvFile } from 'node:process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncRouters } from './sync-routers.mjs';

const require = createRequire(import.meta.url);
const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function packageBin(packageName, binFile = 'bin.cjs') {
  const packageRoot = path.dirname(require.resolve(`${packageName}/package.json`));
  return path.join(packageRoot, binFile);
}

function loadWebConfig(cwd) {
  const tsxEntry = packageBin('tsx', 'dist/cli.mjs');
  const loadScript = path.join(clientRoot, 'scripts/load-config.mjs');
  const result = spawnSync(process.execPath, [tsxEntry, loadScript, cwd], {
    encoding: 'utf8',
    cwd,
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || 'Failed to load duneta.config.ts');
  }

  return JSON.parse(result.stdout);
}

const [command = 'dev', ...rest] = process.argv.slice(2);
const cwd = process.cwd();

try {
  loadEnvFile(path.join(cwd, '.env'));
} catch {
  // Copy .env.example to .env in this directory.
}

let webConfig = null;

if (['dev', 'build', 'typegen'].includes(command)) {
  webConfig = loadWebConfig(cwd);
  syncRouters(cwd, clientRoot, webConfig);
}

let executable = process.execPath;
let args;

switch (command) {
  case 'dev': {
    const port = webConfig?.app?.port ?? 3000;
    console.log(`[duneta-web] dev → http://localhost:${port}`);
    args = [packageBin('@react-router/dev'), command, ...rest];
    break;
  }
  case 'build':
    console.log('[duneta-web] building…');
    args = [packageBin('@react-router/dev'), command, ...rest];
    break;
  case 'typegen':
    args = [packageBin('@react-router/dev'), command, ...rest];
    break;
  case 'start':
    console.log('[duneta-web] production server');
    args = [packageBin('@react-router/serve'), path.join(cwd, 'build/server/index.js'), ...rest];
    break;
  default:
    args = [packageBin('@react-router/dev'), command, ...rest];
}

const result = spawnSync(executable, args, {
  stdio: 'inherit',
  cwd,
  env: {
    ...process.env,
    DUNETA_CLIENT_ROOT: clientRoot,
  },
});

process.exit(result.status ?? 1);
