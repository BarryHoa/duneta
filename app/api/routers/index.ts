import {
  isAuthEnabled,
  isDatabaseEnabled,
  type DunetaServerConfig,
} from '@duneta/server/configs';
import {
  composeRouter,
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

  return composeRouter(groups);
}
