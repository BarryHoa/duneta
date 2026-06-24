import {
  isAuthEnabled,
  isDatabaseEnabled,
  type TenoraServerConfig,
} from '@tenora/server/configs';
import {
  composeRouter,
  createUsersRoutes,
  healthRoutes,
  meRoutes,
} from '@tenora/server/routers';

export function createAppRouter(config: TenoraServerConfig) {
  const groups = [healthRoutes];

  if (isAuthEnabled(config)) {
    groups.push(meRoutes);
  }

  if (isDatabaseEnabled(config)) {
    groups.push(createUsersRoutes());
  }

  return composeRouter(groups);
}
