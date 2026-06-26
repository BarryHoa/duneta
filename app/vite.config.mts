import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDunetaViteConfig } from '../packages/client/configs/vite';

const root = path.dirname(fileURLToPath(import.meta.url));

export default createDunetaViteConfig(root);
