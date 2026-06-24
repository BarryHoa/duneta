import type { MiddlewareHandler } from 'hono';
import { resolveController } from '../http/resolve-controller.js';
import { requireSession } from '../middlewares/session.js';
import { composeRouter, defineGroup } from './define.js';

export const healthRoutes = defineGroup({
  path: '/health',
  endpoints: [{ method: 'GET', handler: resolveController('HealthController', 'show') }],
});

export const meRoutes = defineGroup({
  path: '/me',
  endpoints: [{ method: 'GET', handler: resolveController('MeController', 'show') }],
});

export function createUsersRoutes(middleware: MiddlewareHandler[] = [requireSession()]) {
  return defineGroup({
    path: '/users',
    middleware,
    endpoints: [
      { method: 'GET', handler: resolveController('UserController', 'index') },
      { method: 'GET', path: '/:id', handler: resolveController('UserController', 'show') },
    ],
  });
}

export const usersRoutes = createUsersRoutes();

export { composeRouter, defineGroup, type RouteGroup } from './define.js';
