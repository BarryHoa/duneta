import { defineTenoraConfig } from '@tenora/server/configs';

export default defineTenoraConfig({
  runtime: { target: 'node' },
  app: {
    name: 'tenora-api',
    env:
      (process.env.NODE_ENV as 'development' | 'production' | 'test') ??
      'development',
    port: Number(process.env.PORT ?? 3001),
    debug: true,
  },
});
