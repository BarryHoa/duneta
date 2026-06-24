import { Hono } from 'hono';
import type { Hono as HonoType } from 'hono';
import type { PermissionResolver } from '../../permissions/types.js';
import type { DeepPartial, Runtime, TenoraServerConfig } from '../../configs/index.js';
import type { RegisterServices } from '../../container/index.js';
import type { BackendEnv } from '../../middlewares/env.js';

export type ServerOptions = {
  config: DeepPartial<TenoraServerConfig>;
  createAppRouter?: (config: TenoraServerConfig) => HonoType<BackendEnv>;
  registerServices?: RegisterServices;
  /** Role → grants; loaded by `requireSession()` on protected routes. */
  resolvePermissions?: PermissionResolver;
};

export type ServerBoot = {
  target: Runtime;
  config: DeepPartial<TenoraServerConfig>;
  createAppRouter: (config: TenoraServerConfig) => HonoType<BackendEnv>;
  registerServices: RegisterServices;
  resolvePermissions?: PermissionResolver;
};

const noopRegisterServices: RegisterServices = () => {};

function emptyAppRouter(): HonoType<BackendEnv> {
  return new Hono<BackendEnv>();
}

export function createServerBoot(options: ServerOptions, target: Runtime): ServerBoot {
  return {
    target,
    config: options.config,
    createAppRouter: options.createAppRouter ?? (() => emptyAppRouter()),
    registerServices: options.registerServices ?? noopRegisterServices,
    resolvePermissions: options.resolvePermissions,
  };
}
