import { bindContainerController } from '@tenora/server/http';
import { defineGroup } from '@tenora/server/routers';

export const usersRoutes = defineGroup({
  path: '/users',
  endpoints: [
    { method: 'GET', handler: bindContainerController('UserController', 'index') },
    { method: 'GET', path: '/:id', handler: bindContainerController('UserController', 'show') },
  ],
});
