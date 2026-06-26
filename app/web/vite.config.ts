import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDunetaViteConfig } from '../../packages/client/configs/vite';
import { loadConfig } from '../../packages/client/configs/load';

const webRoot = path.dirname(fileURLToPath(import.meta.url));
const config = await loadConfig(webRoot);

export default createDunetaViteConfig(webRoot, config);
