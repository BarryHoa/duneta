import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webRoot = process.argv[2] ?? process.cwd();

const { loadConfig } = await import(pathToFileURL(path.join(clientRoot, 'configs/load.ts')).href);
const config = await loadConfig(webRoot);
process.stdout.write(JSON.stringify(config));
