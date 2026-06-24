import { defineServer } from '@tenora/server/runtime/cloud';
import config from './tenora.config';
import { createRouter, registerProviders } from './.api-runtime';

export default defineServer({ config, createRouter, providers: registerProviders });
