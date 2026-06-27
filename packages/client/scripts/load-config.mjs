import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const clientRoot = path.dirname(require.resolve('@duneta/client/package.json'));
const webRoot = process.argv[2] ?? process.cwd();

const distLoad = path.join(clientRoot, 'dist/configs/load.js');
const srcLoad = path.join(clientRoot, 'configs/load.ts');
const loadModule = existsSync(distLoad) ? distLoad : srcLoad;

const { loadConfig } = await import(pathToFileURL(loadModule).href);
const config = await loadConfig(webRoot);
process.stdout.write(JSON.stringify(config));
