import { cpSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const tsc = process.platform === 'win32' ? '../../node_modules/.bin/tsc.cmd' : '../../node_modules/.bin/tsc';
const result = spawnSync(tsc, ['-p', 'tsconfig.build.json'], { stdio: 'inherit' });

if (result.error || result.status !== 0) process.exit(result.status ?? 1);

for (const directory of ['IbaseAlertDialog', 'IbaseInput', 'IbaseSelect', 'IbaseForm', 'IbaseUpload', 'IbaseTable', 'IbaseError', 'IbaseLayout']) {
  cpSync(`components/${directory}/types.d.ts`, `dist/components/${directory}/types.d.ts`);
}
