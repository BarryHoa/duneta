import { defineServer } from '@tenora/server/runtime/node';
import { resolvePermissions } from './permissions';
import config from './tenora.config';
import { createAppRouter } from './routers';
import { registerServices } from './services';

export default defineServer({
  config,
  createAppRouter,
  registerServices,
  resolvePermissions,
});
