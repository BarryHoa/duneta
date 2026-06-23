import { Hono } from 'hono';
import type { Handler, MiddlewareHandler } from 'hono';
import type { BackendEnv } from '../middlewares/index.js';

type Endpoint = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path?: string;
  handler: Handler<BackendEnv>;
};

export type RouterGroup = {
  /** Mount path relative to its parent. Both `:id` and `/:id` are accepted. */
  path: string;
  middleware?: MiddlewareHandler<BackendEnv>[];
  endpoints?: Endpoint[];
  children?: RouterGroup[];
};

export function defineGroup(group: RouterGroup): RouterGroup {
  return group;
}

function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function createGroup(group: RouterGroup) {
  const router = new Hono<BackendEnv>();

  if (group.middleware?.length) router.use('*', ...group.middleware);

  for (const endpoint of group.endpoints ?? []) {
    router.on(endpoint.method, endpoint.path ?? '/', endpoint.handler);
  }

  for (const child of group.children ?? []) {
    router.route(normalizePath(child.path), createGroup(child));
  }

  return router;
}

export function createRouter(groups: RouterGroup[]) {
  const router = new Hono<BackendEnv>();
  for (const group of groups) router.route(normalizePath(group.path), createGroup(group));
  return router;
}
