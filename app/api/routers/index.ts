import { getConfig } from '@tenora/server/configs';
import { createDefaultRouter } from '@tenora/server/routers';

export const router = createDefaultRouter(getConfig());
