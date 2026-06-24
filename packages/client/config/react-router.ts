import type { Config } from '@react-router/dev/config';
import type { TenoraWebConfig } from '../configs/types.js';

export function createReactRouterConfig(webConfig: TenoraWebConfig): Config {
  return {
    appDirectory: webConfig.router.appDirectory,
  };
}
