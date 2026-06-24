import { defineServer } from '@tenora/server/runtime/node';
import config from './tenora.config';
import { registerProviders } from './providers';
import { createRouter } from './routers';

export default defineServer({ config, createRouter, providers: registerProviders });
