import { createDefaultConfig } from './defaults';
import { mergeConfig, type DeepPartial } from './merge';
import { commitConfig } from './registry';
import type { TenoraServerConfig } from './types';

/** Like `defineConfig` in Next.js — all sections are optional. */
export function defineTenoraConfig<const T extends Record<string, unknown>>(
  config?: DeepPartial<TenoraServerConfig> & T,
): DeepPartial<TenoraServerConfig> & T {
  return (config ?? {}) as DeepPartial<TenoraServerConfig> & T;
}

/** Merge `tenora.config.ts` overrides onto defaults and cache the result. */
export function loadConfig(overrides?: DeepPartial<TenoraServerConfig>): TenoraServerConfig {
  return commitConfig(mergeConfig(createDefaultConfig(), overrides));
}
