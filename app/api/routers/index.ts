import { getServiceStatus } from '@tenora/server/services';
import { healthResponseSchema } from '@tenora/server/validators';
import { x, y, z } from '@tenora/server/middlewares';
import { createRouter, defineGroup } from './define';

export const router = createRouter([
  defineGroup({
    path: '/health',
    endpoints: [
      {
        method: 'GET',
        handler: (c) => c.json(healthResponseSchema.parse(getServiceStatus())),
      },
    ],
  }),
  defineGroup({
    path: '/con',
    middleware: [x, y],
    children: [
      defineGroup({
        path: ':id',
        middleware: [z],
        endpoints: [
          {
            method: 'GET',
            handler: (c) => c.json({ id: c.req.param('id'), middleware: c.get('middlewareOrder') }),
          },
        ],
      }),
    ],
  }),
]);
