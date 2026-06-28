import { loadApp } from '../shared/boot.js';
import type { ServerOptions } from '../shared/types.js';
import { loadServerConfig } from './load-config.js';

export type { ServerOptions } from '../shared/types.js';
export type {
  RegisterServices,
  ServiceRegistryContext,
} from '../../container/index.js';

export type ServerExport = {
  fetch: (request: Request) => Promise<Response>;
};

export function defineServer(options: ServerOptions): ServerExport {
  let boot: Promise<void> | undefined;

  async function ensureBoot() {
    if (!boot) {
      boot = loadServerConfig(options.importConfig).then(() => undefined);
    }
    await boot;
  }

  return {
    async fetch(request) {
      await ensureBoot();
      const hono = await loadApp(options);
      return hono.fetch(request);
    },
  };
}
