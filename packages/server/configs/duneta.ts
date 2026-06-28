import type { DeepPartial } from './merge.js';
import type { DunetaServerConfig } from './types.js';

export const SERVER_CONFIG_FILENAME = 'duneta.server.config.ts';

/** API sections — `duneta.server.config.ts` (Worker only). */
export type DunetaServerConfigFile = DeepPartial<DunetaServerConfig>;

export function defineServerConfig<const T extends DunetaServerConfigFile>(config?: T): T {
  return (config ?? {}) as T;
}
