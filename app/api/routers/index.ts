import {
  isAuthEnabled,
  isDatabaseEnabled,
  type TenoraServerConfig,
} from '@tenora/server/configs';
import {
  createRouter as buildRouter,
  healthRoutes,
  meRoutes,
  usersRoutes,
} from '@tenora/server/routers';

// import { postsRoutes } from './posts.routes';

export function createRouter(config: TenoraServerConfig) {
  const groups = [healthRoutes];

  if (isAuthEnabled(config)) {
    groups.push(meRoutes);
  }

  if (isDatabaseEnabled(config)) {
    groups.push(usersRoutes);
  }

  // groups.push(postsRoutes);

  return buildRouter(groups);
}
