import { composeRouter, healthRoutes } from '@duneta/server/routers';
import type { DunetaServerConfig } from '@duneta/server/configs';

export function createAppRouter(_config: DunetaServerConfig) {
  return composeRouter([healthRoutes]);
}
