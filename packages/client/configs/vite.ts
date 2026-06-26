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
      chunkSizeWarningLimit: 550,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const herouiComponent = id.match(
              /node_modules\/@heroui\/react\/dist\/components\/([^/]+)/,
            );
            if (herouiComponent) return `heroui-${herouiComponent[1]}`;
            if (id.includes('node_modules/@heroui/react/dist/hooks/')) return 'heroui-hooks';
            if (id.includes('node_modules/@heroui/react/dist/utils/')) return 'heroui-utils';
            if (id.includes('node_modules/tailwind-variants')) return 'vendor-tailwind-variants';
            if (id.includes('node_modules/@heroui/styles')) return 'vendor-heroui-styles';
            if (id.includes('node_modules/react-aria-components')) return 'vendor-rac';
            if (id.includes('node_modules/@react-aria/')) return 'vendor-react-aria';
            if (id.includes('node_modules/@react-stately/')) return 'vendor-react-stately';
            if (id.includes('node_modules/@internationalized/')) return 'vendor-intl';
            if (id.includes('node_modules/@heroui/')) return 'vendor-heroui';
            if (id.includes('node_modules/@tanstack/')) return 'vendor-tanstack';
            if (id.includes('node_modules/@dnd-kit/')) return 'vendor-dnd-kit';
            if (id.includes('node_modules/lucide-react')) return 'vendor-lucide';
            if (id.includes('/components/DunetaDataTable/')) return 'duneta-datatable';
          },
        },
        onwarn(warning, warn) {
          if (
            warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
            (warning.code === 'SOURCEMAP_ERROR' &&
              warning.message.includes("Can't resolve original location"))
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
    ...overrides,
  });
}
