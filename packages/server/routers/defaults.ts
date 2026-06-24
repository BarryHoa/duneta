import { bindContainerController } from '../http/bind-controller.js';
import { isAuthEnabled, isDatabaseEnabled } from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import { requireAuth } from '../middlewares/auth.js';
import { createRouter, defineGroup } from './define.js';

export const healthRoutes = defineGroup({
  path: '/health',
  endpoints: [{ method: 'GET', handler: bindContainerController('HealthController', 'show') }],
});

export const meRoutes = defineGroup({
  path: '/me',
  endpoints: [{ method: 'GET', handler: bindContainerController('MeController', 'show') }],
});

export const usersRoutes = defineGroup({
  path: '/users',
  middleware: [requireAuth()],
  endpoints: [
    { method: 'GET', handler: bindContainerController('UserController', 'index') },
    { method: 'GET', path: '/:id', handler: bindContainerController('UserController', 'show') },
  ],
});

export function createDefaultRouter(config: TenoraServerConfig) {
  const groups = [healthRoutes];

  if (isAuthEnabled(config)) {
    groups.push(meRoutes);
  }

  if (isDatabaseEnabled(config)) {
    groups.push(usersRoutes);
  }

  return createRouter(groups);
}
