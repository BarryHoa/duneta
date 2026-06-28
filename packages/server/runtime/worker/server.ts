import { createCronKernel, runDueCronJobs } from '../../cron/index.js';
import { isCronEnabled } from '../../configs/features.js';
import { loadApp, loadRuntimeServices } from '../shared/boot.js';
import type { ServerOptions } from '../shared/types.js';
import { loadServerConfig } from './load-config.js';

export type { ServerOptions } from '../shared/types.js';
export type {
  RegisterServices,
  ServiceRegistryContext,
} from '../../container/index.js';

export type ScheduledControllerLike = {
  cron: string;
  scheduledTime: number;
};

export type ExecutionContextLike = {
  waitUntil(promise: Promise<unknown>): void;
};

export type ServerExport = {
  fetch: (request: Request) => Promise<Response>;
  scheduled: (
    controller: ScheduledControllerLike,
    env: unknown,
    ctx: ExecutionContextLike,
  ) => Promise<void>;
};

export function defineServer(options: ServerOptions): ServerExport {
  let boot: Promise<void> | undefined;

  async function ensureBoot() {
    if (!boot) {
      boot = loadServerConfig(options.importConfig).then(() => undefined);
    }
    await boot;
  }

  return {
    async fetch(request) {
      await ensureBoot();
      const hono = await loadApp(options);
      return hono.fetch(request);
    },
    async scheduled(controller, _env, ctx) {
      await ensureBoot();
      const runtime = await loadRuntimeServices(options);
      if (!isCronEnabled(runtime.config)) return;

      const kernel = await createCronKernel(options.registerCron);
      await runDueCronJobs(kernel.due(controller.cron), {
        cron: controller.cron,
        scheduledTime: controller.scheduledTime,
        config: runtime.config,
        db: runtime.db,
        auth: runtime.auth,
        cache: runtime.cache,
        controllers: runtime.controllers,
        repositories: runtime.repositories,
        waitUntil: (promise) => ctx.waitUntil(promise),
      });
    },
  };
}
