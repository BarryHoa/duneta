import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTenoraViteConfig } from '@tenora/client/config/vite';
import { loadConfig } from '@tenora/client/configs';

const webRoot = path.dirname(fileURLToPath(import.meta.url));
const config = await loadConfig(webRoot);

export default createTenoraViteConfig(webRoot, config);
