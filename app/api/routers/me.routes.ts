import { bindContainerController } from '@tenora/server/http';
import { defineGroup } from '@tenora/server/routers';

export const meRoutes = defineGroup({
  path: '/me',
  endpoints: [{ method: 'GET', handler: bindContainerController('MeController', 'show') }],
});
