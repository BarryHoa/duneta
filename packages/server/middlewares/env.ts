import type { Auth } from '../auth/types.js';
import type { Cache } from '../cache/index.js';
import type { ControllerContainer } from '../container/controller-container.js';
import type { RepositoryContainer } from '../container/repository-container.js';
import type { Database } from '../database/types.js';

export type BackendEnv = {
  Variables: {
    db?: Database;
    auth?: Auth;
    cache?: Cache;
    controllers: ControllerContainer;
    repositories: RepositoryContainer;
    userId?: string;
    requestId: string;
    locale: string;
    timezone: string;
  };
  Bindings: Record<string, string | undefined>;
};
