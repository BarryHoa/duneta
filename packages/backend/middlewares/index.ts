import { createMiddleware } from 'hono/factory';

export type BackendEnv = { Variables: { middlewareOrder: string[] } };

function track(name: string) {
  return createMiddleware<BackendEnv>(async (c, next) => {
    c.set('middlewareOrder', [...(c.get('middlewareOrder') ?? []), name]);
    await next();
  });
}

export const x = track('x');
export const y = track('y');
export const z = track('z');
