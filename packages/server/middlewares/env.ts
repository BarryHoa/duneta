import type { Auth } from '../auth/types.js';
import type { CacheClient } from '../cache/index.js';
import type { Container } from '../container/index.js';
import type { Database } from '../database/types.js';

export type BackendEnv = {
  Variables: {
    db?: Database;
    auth?: Auth;
    cache?: CacheClient;
    container: Container;
    userId?: string;
    locale: string;
    timezone: string;
    middlewareOrder?: string[];
  };
  Bindings: Record<string, string | undefined>;
};
