import { defineGroup } from '@duneta/server/routers';
import { resolveController } from '@duneta/server/http';
import { requireSession } from '@duneta/server/middlewares/session.js';

const controllerKey = 'ImageMediaStorageController';

export const imageMediaStorageRoutes = defineGroup({
  path: '/media',
  middleware: [requireSession()],
  endpoints: [
    { method: 'POST', path: '/images', handler: resolveController(controllerKey, 'store') },
    { method: 'GET', path: '/images/meta', handler: resolveController(controllerKey, 'head') },
    { method: 'DELETE', path: '/images', handler: resolveController(controllerKey, 'destroy') },
  ],
});
