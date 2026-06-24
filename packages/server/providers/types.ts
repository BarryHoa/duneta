import type { Hono } from 'hono';
import type { TenoraServerConfig } from '../configs/types.js';
import type { Container } from '../container/index.js';
import type { BackendEnv } from '../middlewares/env.js';

export interface TenoraProvider {
  register(
    app: Hono<BackendEnv>,
    config: TenoraServerConfig,
    container: Container,
  ): void | Promise<void>;
}

export interface AppContext {
  app: Hono<BackendEnv>;
  config: TenoraServerConfig;
  container: Container;
}

export async function registerProviders(
  context: AppContext,
  providers: TenoraProvider[],
): Promise<void> {
  for (const provider of providers) {
    await provider.register(context.app, context.config, context.container);
  }
}
