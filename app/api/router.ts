import { composeRouter, createUsersRoutes, healthRoutes, meRoutes } from '@duneta/server/routers';
import type { DunetaServerConfig } from '@duneta/server/configs';
import { imageMediaStorageRoutes } from './Controllers/MediaStorage/index.js';

export function createAppRouter(_config: DunetaServerConfig) {
  return composeRouter([
    healthRoutes,
    meRoutes,
    createUsersRoutes(),
    imageMediaStorageRoutes,
  ]);
}
