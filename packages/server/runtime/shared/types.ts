import { Hono } from 'hono';
import type { Hono as HonoType } from 'hono';
import type { PermissionResolver } from '../../permissions/types.js';
import type { DeepPartial, Runtime, DunetaServerConfig } from '../../configs/index.js';
import type { RegisterServices } from '../../container/index.js';
import type { RequestContext } from '../../middlewares/request-context.js';

export type ServerConfigLoader = () =>
  | DeepPartial<DunetaServerConfig>
  | Promise<DeepPartial<DunetaServerConfig>>;

export type ServerOptions = {
  /** Avoid in worker — secrets bake at build. Use `loadConfig`. */
  config?: DeepPartial<DunetaServerConfig>;
  /** Dynamic import `duneta.server.config.ts` at runtime (after Worker env). */
  loadConfig?: ServerConfigLoader;
  createAppRouter?: (config: DunetaServerConfig) => HonoType<RequestContext>;
  registerServices?: RegisterServices;
  /** Role → grants; loaded by `requireSession()` on protected routes. */
  resolvePermissions?: PermissionResolver;
};

export type ServerBoot = {
  target: Runtime;
  config: DeepPartial<DunetaServerConfig>;
  createAppRouter: (config: DunetaServerConfig) => HonoType<RequestContext>;
  registerServices: RegisterServices;
  resolvePermissions?: PermissionResolver;
};

const noopRegisterServices: RegisterServices = () => {};

function emptyAppRouter(): HonoType<RequestContext> {
  return new Hono<RequestContext>();
}

export function createServerBoot(
  options: ServerOptions & { config: DeepPartial<DunetaServerConfig> },
  target: Runtime,
): ServerBoot {
  return {
    target,
    config: options.config,
    createAppRouter: options.createAppRouter ?? (() => emptyAppRouter()),
    registerServices: options.registerServices ?? noopRegisterServices,
    resolvePermissions: options.resolvePermissions,
  };
}
