import {
  isAuthEnabled,
  isDatabaseEnabled,
  isStorageEnabled,
  type DunetaServerConfig,
} from '@duneta/server/configs';
import {
  composeRouter,
  createStorageRoutes,
  createUsersRoutes,
  healthRoutes,
  meRoutes,
} from '@duneta/server/routers';

export function createAppRouter(config: DunetaServerConfig) {
  const groups = [healthRoutes];

  if (isAuthEnabled(config)) {
    groups.push(meRoutes);
  }

  if (isDatabaseEnabled(config)) {
    groups.push(createUsersRoutes());
  }

  if (isStorageEnabled(config)) {
    groups.push(createStorageRoutes());
  }

  return composeRouter(groups);
}
