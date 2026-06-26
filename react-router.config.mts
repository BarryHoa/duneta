import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReactRouterConfig } from './packages/client/configs/react-router';
import { loadConfig } from './packages/client/configs/load';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const config = await loadConfig(repoRoot);

export default createReactRouterConfig(config);
