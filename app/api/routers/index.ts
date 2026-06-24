import type { TenoraServerConfig } from '@tenora/server/configs';
import { createDefaultRouter } from '@tenora/server/routers';

export function createRouter(config: TenoraServerConfig) {
  return createDefaultRouter(config);
}
