import { defineServer } from '@duneta/server/runtime/node';
import { resolvePermissions } from './permissions';
import config from './duneta.config';
import { createAppRouter } from './routers';
import { registerServices } from './services';

export default defineServer({
  config,
  createAppRouter,
  registerServices,
  resolvePermissions,
});
