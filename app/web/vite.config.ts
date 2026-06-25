import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTenoraViteConfig } from '@tenora/client/configs/vite';
import { loadConfig } from '../../packages/client/configs/load';

const webRoot = path.dirname(fileURLToPath(import.meta.url));
const config = await loadConfig(webRoot);

export default createTenoraViteConfig(webRoot, config);
