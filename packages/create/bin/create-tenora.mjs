#!/usr/bin/env node
import { cpSync, existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const templateDirectory = resolve(packageDirectory, 'template');
const targetArgument = process.argv[2];

if (!targetArgument || ['--help', '-h'].includes(targetArgument)) {
  console.log('Usage: pnpm create tenora <project-name>');
  process.exit(targetArgument ? 0 : 1);
}

const targetDirectory = resolve(process.cwd(), targetArgument);
if (existsSync(targetDirectory) && readdirSync(targetDirectory).length > 0) {
  console.error(`Cannot create Tenora in ${targetDirectory}: directory is not empty.`);
  process.exit(1);
}

const { version } = JSON.parse(readFileSync(resolve(packageDirectory, 'package.json'), 'utf8'));
cpSync(templateDirectory, targetDirectory, { recursive: true });
renameSync(resolve(targetDirectory, 'gitignore'), resolve(targetDirectory, '.gitignore'));

const manifestPath = resolve(targetDirectory, 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
manifest.name = basename(targetDirectory).toLowerCase().replace(/[^a-z0-9-]/g, '-');
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

for (const relativePath of ['apps/api/package.json', 'apps/web/package.json']) {
  const path = resolve(targetDirectory, relativePath);
  writeFileSync(path, readFileSync(path, 'utf8').replaceAll('workspace-version', `^${version}`));
}

console.log(`\nCreated ${manifest.name}.\n\nNext steps:\n  cd ${targetArgument}\n  pnpm install\n  pnpm dev\n`);
