import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTenoraViteConfig } from '@tenora/client/config/vite';

const webRoot = path.dirname(fileURLToPath(import.meta.url));

export default createTenoraViteConfig(webRoot);
