import { getConfig, isAuthEnabled, isDatabaseEnabled } from '@tenora/server/configs';
import { createRouter } from '@tenora/server/routers';
import { healthRoutes } from './health.routes.js';
import { meRoutes } from './me.routes.js';
import { usersRoutes } from './users.routes.js';

const config = getConfig();
const groups = [healthRoutes];

if (isAuthEnabled(config)) {
  groups.push(meRoutes);
}

if (isDatabaseEnabled(config)) {
  groups.push(usersRoutes);
}

export const router = createRouter(groups);
