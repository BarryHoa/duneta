import type { Config } from '@react-router/dev/config';
import type { TenoraWebConfig } from '../configs/types.js';

export function defineReactRouterConfig(overrides: Partial<Config> = {}): Config {
  return {
    appDirectory: '.router-runtime',
    ...overrides,
  };
}

/** @deprecated Use `tenora.config.ts` or `defineReactRouterConfig`. */
export const defineTenoraConfig = defineReactRouterConfig;

export function createReactRouterConfig(webConfig: TenoraWebConfig): Config {
  return {
    appDirectory: webConfig.router.appDirectory,
  };
}
