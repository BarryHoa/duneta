import type { Context, Handler } from 'hono';
import type { BaseController } from './base-controller.js';
import type { BackendEnv } from '../middlewares/env.js';

type ControllerHandler = (c: Context<BackendEnv>) => Response | Promise<Response>;

export function resolveController(key: string, method: string): Handler<BackendEnv> {
  return (c) => {
    const controller = c.get('controllers').resolve<BaseController>(key);
    const handler = (controller as unknown as Record<string, ControllerHandler>)[method];
    if (typeof handler !== 'function') {
      throw new Error(`Controller "${key}" has no handler "${method}".`);
    }
    return handler.call(controller, c);
  };
}
