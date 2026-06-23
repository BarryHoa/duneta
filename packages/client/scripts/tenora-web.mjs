#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
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

const [command = 'dev', ...rest] = process.argv.slice(2);
const cwd = process.cwd();

if (['dev', 'build', 'typegen'].includes(command)) {
  syncRouters(cwd, clientRoot);
}

let executable = process.execPath;
let args;

switch (command) {
  case 'dev':
  case 'build':
  case 'typegen':
    args = [packageBin('@react-router/dev'), command, ...rest];
    break;
  case 'start':
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
    TENORA_CLIENT_ROOT: clientRoot,
  },
});

process.exit(result.status ?? 1);
