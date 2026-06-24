import { bindContainerController } from '@tenora/server/http';
import { requireAuth } from '@tenora/server/middlewares';
import { defineGroup } from '@tenora/server/routers';

export const usersRoutes = defineGroup({
  path: '/users',
  middleware: [requireAuth()],
  endpoints: [
    { method: 'GET', handler: bindContainerController('UserController', 'index') },
    { method: 'GET', path: '/:id', handler: bindContainerController('UserController', 'show') },
  ],
});
