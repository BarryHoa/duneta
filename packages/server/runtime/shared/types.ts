import { Hono } from 'hono';
import type { Hono as HonoType } from 'hono';
import type { DeepPartial, Runtime, TenoraServerConfig } from '../../configs/index.js';
import type { RegisterBindings } from '../../container/index.js';
import type { BackendEnv } from '../../middlewares/env.js';

export type ServerOptions = {
  config: DeepPartial<TenoraServerConfig>;
  createRouter?: (config: TenoraServerConfig) => HonoType<BackendEnv>;
  /** App controllers/repositories — framework defaults are wired in boot. */
  providers?: RegisterBindings;
};

export type ServerManifest = {
  /** Set by `defineServer` from `runtime/cloud` or `runtime/node` — do not set in tenora.config. */
  target: Runtime;
  config: DeepPartial<TenoraServerConfig>;
  createRouter: (config: TenoraServerConfig) => HonoType<BackendEnv>;
  providers: RegisterBindings;
};

const noopProviders: RegisterBindings = () => {};

function emptyAppRouter(): HonoType<BackendEnv> {
  return new Hono<BackendEnv>();
}

export function toManifest(options: ServerOptions, target: Runtime): ServerManifest {
  return {
    target,
    config: options.config,
    createRouter: options.createRouter ?? (() => emptyAppRouter()),
    providers: options.providers ?? noopProviders,
  };
}
