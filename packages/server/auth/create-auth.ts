import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { isAuthEnabled } from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { Database } from '../database/types.js';
import * as schema from '../repositories/schemas/auth.js';

export function createAuth(config: TenoraServerConfig, db: Database | null) {
  if (!isAuthEnabled(config) || !db) return null;

  const { auth: authConfig } = config;

  return betterAuth({
    secret: authConfig.secret,
    baseURL: authConfig.baseUrl,
    basePath: authConfig.basePath,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: authConfig.emailAndPassword.enabled,
    },
    session: {
      expiresIn: Math.floor(config.session.expiration.default / 1000),
      cookieCache: {
        enabled: true,
        maxAge: config.session.cookie.maxAge.default,
      },
    },
  });
}

export type Auth = NonNullable<ReturnType<typeof createAuth>>;
