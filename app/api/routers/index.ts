import { getServiceStatus } from '../services/index.js';
import { healthResponseSchema } from '@tenora/server/validators';
import { x, y, z } from '../middlewares/index.js';
import { createRouter, defineGroup } from '@tenora/server/routers';

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
