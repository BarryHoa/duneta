import type { Config } from '@react-router/dev/config';
import type { TenoraWebConfig } from './types.js';

export function createReactRouterConfig(webConfig: TenoraWebConfig): Config {
  return {
    appDirectory: webConfig.router.appDirectory,
  };
}
