import { bindContainerController } from '@tenora/server/http';
import { defineGroup } from '@tenora/server/routers';

export const healthRoutes = defineGroup({
  path: '/health',
  endpoints: [{ method: 'GET', handler: bindContainerController('HealthController', 'show') }],
});
