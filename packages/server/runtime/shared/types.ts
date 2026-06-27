import { Hono } from 'hono';
import type { Hono as HonoType } from 'hono';
import type { PermissionResolver } from '../../permissions/types.js';
import type { DeepPartial, DunetaServerConfig } from '../../configs/index.js';
import type { RegisterServices } from '../../container/index.js';
import type { RequestContext } from '../../middlewares/request-context.js';

export type ServerConfigImport = () => Promise<{ default?: DeepPartial<DunetaServerConfig> }>;

export type ServerOptions = {
  /** Dynamic import `duneta.server.config.ts` — `process.env` from Wrangler. */
  importConfig: ServerConfigImport;
  createAppRouter?: (config: DunetaServerConfig) => HonoType<RequestContext>;
  registerServices?: RegisterServices;
  /** Role → grants; loaded by `requireSession()` on protected routes. */
  resolvePermissions?: PermissionResolver;
};

const noopRegisterServices: RegisterServices = () => {};

function emptyAppRouter(): HonoType<RequestContext> {
  return new Hono<RequestContext>();
}

export function resolveServerHandlers(options: ServerOptions) {
  return {
    createAppRouter: options.createAppRouter ?? (() => emptyAppRouter()),
    registerServices: options.registerServices ?? noopRegisterServices,
    resolvePermissions: options.resolvePermissions,
  };
}
