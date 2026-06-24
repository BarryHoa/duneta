import type { Context } from 'hono';
import type { BackendEnv } from '../middlewares/env.js';
import { createPermissionCheck } from './check.js';
import type { PermissionCheck, PermissionContext, PermissionResolver } from './types.js';

let resolver: PermissionResolver | undefined;

export function registerPermissionResolver(fn: PermissionResolver) {
  resolver = fn;
}

export function getPermissionResolver() {
  return resolver;
}

export function getPermissionContext(c: Context<BackendEnv>) {
  return c.get('permissionContext');
}

export function getPermissionCheck(c: Context<BackendEnv>) {
  return c.get('permissionCheck');
}

export function requirePermissionCheck(c: Context<BackendEnv>): PermissionCheck {
  const check = getPermissionCheck(c);
  if (!check) {
    throw new Error('Permissions not loaded. Pass resolvePermissions to defineServer() and use requireSession().');
  }
  return check;
}

export function setPermissions(c: Context<BackendEnv>, context: PermissionContext): PermissionCheck {
  const check = createPermissionCheck(context);
  c.set('permissionContext', context);
  c.set('permissionCheck', check);
  return check;
}
