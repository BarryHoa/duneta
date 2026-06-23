import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig, type UserConfig } from 'vite';

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function createTenoraViteConfig(webRoot: string, overrides: UserConfig = {}): UserConfig {
  const envDir = path.resolve(webRoot, '../..');
  const apiPort = process.env.TENORA_API_PORT ?? '3001';
  const apiProxyTarget = process.env.API_PROXY_TARGET ?? `http://localhost:${apiPort}`;
  const webPort = Number(process.env.TENORA_WEB_PORT ?? 3000);

  return defineConfig({
    envDir,
    plugins: [tailwindcss(), reactRouter()],
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
      port: webPort,
      proxy: {
        '/api': apiProxyTarget,
      },
    },
    ...overrides,
  });
}
