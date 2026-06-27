import { createDefaultConfig } from './defaults';
import { mergeConfig, type DeepPartial } from './merge';
import { commitConfig } from './registry';
import type { DunetaServerConfig } from './types';

/** Like `defineConfig` in Next.js — all sections are optional. */
export function defineDunetaConfig<const T extends Record<string, unknown>>(
  config?: DeepPartial<DunetaServerConfig> & T,
): DeepPartial<DunetaServerConfig> & T {
  return (config ?? {}) as DeepPartial<DunetaServerConfig> & T;
}

/** Merge server config patch onto framework defaults and cache the result. */
export function loadConfig(overrides?: DeepPartial<DunetaServerConfig>): DunetaServerConfig {
  return commitConfig(mergeConfig(createDefaultConfig(), overrides));
}
