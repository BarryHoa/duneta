import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';

const corepack = process.platform === 'win32' ? 'corepack.cmd' : 'corepack';
const turbo = process.platform === 'win32' ? 'node_modules/.bin/turbo.cmd' : 'node_modules/.bin/turbo';
const corepackHome = process.env.COREPACK_HOME ?? join(tmpdir(), 'tenora-corepack');
const shimDirectory = join(tmpdir(), 'tenora-bin');

mkdirSync(shimDirectory, { recursive: true });

const enabled = spawnSync(corepack, ['enable', '--install-directory', shimDirectory], {
  stdio: 'inherit',
  env: { ...process.env, COREPACK_HOME: corepackHome },
});

if (enabled.error || enabled.status !== 0) process.exit(enabled.status ?? 1);

const result = spawnSync(turbo, process.argv.slice(2), {
  stdio: 'inherit',
  env: {
    ...process.env,
    COREPACK_HOME: corepackHome,
    PATH: `${shimDirectory}${delimiter}${process.env.PATH ?? ''}`,
  },
});

if (result.error || result.status !== 0) process.exit(result.status ?? 1);
