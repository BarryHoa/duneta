import { composeRouter, createUsersRoutes, healthRoutes, meRoutes } from '@duneta/server/routers';
import type { DunetaServerConfig } from '@duneta/server/configs';

export function createAppRouter(_config: DunetaServerConfig) {
  return composeRouter([healthRoutes, meRoutes, createUsersRoutes()]);
}
