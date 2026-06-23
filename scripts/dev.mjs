import { existsSync, mkdirSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';

const corepack = process.platform === 'win32' ? 'corepack.cmd' : 'corepack';
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const corepackHome = process.env.COREPACK_HOME ?? join(tmpdir(), 'tenora-corepack');
const shimDirectory = join(tmpdir(), 'tenora-bin');

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      COREPACK_HOME: corepackHome,
      PATH: `${shimDirectory}${delimiter}${process.env.PATH ?? ''}`,
    },
  });
  if (result.error || result.status !== 0) process.exit(result.status ?? 1);
}

function runTogether(commands) {
  const children = commands.map(([command, args]) =>
    spawn(command, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        COREPACK_HOME: corepackHome,
        PATH: `${shimDirectory}${delimiter}${process.env.PATH ?? ''}`,
      },
    }),
  );

  const stop = (signal) => children.forEach((child) => child.kill(signal));
  process.once('SIGINT', () => stop('SIGINT'));
  process.once('SIGTERM', () => stop('SIGTERM'));

  return new Promise((resolve) => {
    let finished = false;
    const finish = (code) => {
      if (finished) return;
      finished = true;
      stop('SIGTERM');
      resolve(code);
    };

    for (const child of children) {
      child.once('exit', (code) => finish(code ?? 1));
      child.once('error', () => finish(1));
    }
  }).then((code) => process.exit(code));
}

if (!existsSync('node_modules')) run(corepack, ['pnpm', 'install']);
mkdirSync(shimDirectory, { recursive: true });
run(corepack, ['enable', '--install-directory', shimDirectory]);

if (process.argv[2] === 'cloudflare') {
  await runTogether([
    [pnpm, ['--filter', 'web', 'dev']],
    [pnpm, ['--filter', 'api', 'dev:cloudflare']],
  ]);
} else {
  await runTogether([
    [pnpm, ['--filter', 'web', 'dev']],
    [pnpm, ['--filter', 'api', 'dev']],
  ]);
}
