import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig, type UserConfig } from 'vite';
// @ts-expect-error — runtime .mjs script without types
import { routerSyncPlugin } from '../scripts/router-sync-plugin.mjs';
import type { TenoraWebConfig } from './types.js';

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function createTenoraViteConfig(
  webRoot: string,
  webConfig: TenoraWebConfig,
  overrides: UserConfig = {},
): UserConfig {
  const apiProxyTarget =
    webConfig.api.proxyTarget ?? `http://localhost:${webConfig.api.port}`;

  return defineConfig({
    envDir: path.resolve(webRoot),
    publicDir: path.resolve(webRoot, 'public'),
    plugins: [
      tailwindcss(),
      routerSyncPlugin(webRoot, clientRoot, webConfig),
      reactRouter(),
    ],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(webConfig.api.baseUrl),
    },
    resolve: {
      alias: {
        '@tenora/client': clientRoot,
        '~': webRoot,
      },
    },
    ssr: {
      noExternal: [/^@tenora\/client/, /^@heroui\//],
    },
    server: {
      port: webConfig.app.port,
      proxy: {
        '/api': apiProxyTarget,
      },
    },
    ...overrides,
  });
}
