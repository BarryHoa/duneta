import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDunetaViteConfig } from '@duneta/client/configs/vite';
import { loadConfig } from '@duneta/client/configs/load';

const webRoot = path.dirname(fileURLToPath(import.meta.url));
const config = await loadConfig(webRoot);

export default createDunetaViteConfig(webRoot, config);
