import { defineServer } from '@tenora/server/runtime/node';
import config from './tenora.config';
import { createRouter, registerProviders } from './.api-runtime';

export default defineServer({ config, createRouter, providers: registerProviders });
