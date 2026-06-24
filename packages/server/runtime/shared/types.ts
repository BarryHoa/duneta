import type { Hono } from 'hono';
import type { DeepPartial, TenoraServerConfig } from '../../configs/index.js';
import type { RegisterBindings } from '../../container/index.js';
import type { BackendEnv } from '../../middlewares/env.js';

export type ServerOptions = {
  config: DeepPartial<TenoraServerConfig>;
  createRouter: (config: TenoraServerConfig) => Hono<BackendEnv>;
  /** Register controllers/repositories — like `createRouter` but for DI bindings. */
  providers?: RegisterBindings;
};

export type ServerManifest = {
  config: DeepPartial<TenoraServerConfig>;
  createRouter: (config: TenoraServerConfig) => Hono<BackendEnv>;
  providers: RegisterBindings;
};

export function toManifest(
  options: ServerOptions,
  fallbackProviders: RegisterBindings,
): ServerManifest {
  return {
    config: options.config,
    createRouter: options.createRouter,
    providers: options.providers ?? fallbackProviders,
  };
}
