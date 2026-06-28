#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const bin =
  require.resolve('duneta/package.json').replace(/package\.json$/, 'bin/duneta.mjs');

const r = spawnSync(process.execPath, [bin, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
});

process.exit(r.status ?? 1);
