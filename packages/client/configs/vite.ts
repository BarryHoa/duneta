import path from 'node:path';
import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig, type UserConfig } from 'vite';

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverRoot = path.resolve(clientRoot, '../server');

export function createDunetaViteConfig(repoRoot: string, appRoot: string, overrides: UserConfig = {}): UserConfig {
  return defineConfig({
    envDir: repoRoot,
    publicDir: path.resolve(appRoot, 'public'),
    server: {
      port: 8787,
    },
    plugins: [
      cloudflare({
        configPath: path.resolve(repoRoot, 'wrangler.jsonc'),
        viteEnvironment: { name: 'ssr' },
      }),
      tailwindcss(),
      reactRouter(),
    ],
    resolve: {
      alias: {
        '@duneta/client': clientRoot,
        '@duneta/server': serverRoot,
        '~': appRoot,
      },
    },
    ssr: {
      noExternal: [/^@duneta\/client/, /^@duneta\/server/, /^@heroui\//],
    },
    css: {
      devSourcemap: false,
    },
    build: {
      sourcemap: false,
    },
    ...overrides,
  });
}
