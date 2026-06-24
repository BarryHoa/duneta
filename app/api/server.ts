import { defineServer } from '@tenora/server/runtime/cloud';
import { resolvePermissions } from './permissions';
import config from './tenora.config';
import { createAppRouter, registerServices } from './.api-runtime';

export default defineServer({
  config,
  createAppRouter,
  registerServices,
  resolvePermissions,
});
