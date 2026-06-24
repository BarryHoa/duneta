import { getConfig, isDatabaseEnabled } from '@tenora/server/configs';
import { createRouter } from '@tenora/server/routers';
import { healthRoutes } from './health.routes.js';
import { usersRoutes } from './users.routes.js';

const groups = [healthRoutes];

if (isDatabaseEnabled(getConfig())) {
  groups.push(usersRoutes);
}

export const router = createRouter(groups);
