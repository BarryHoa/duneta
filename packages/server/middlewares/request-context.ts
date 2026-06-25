import type { Auth } from '../auth/types.js';
import type { PermissionCheck, PermissionContext } from '../permissions/types.js';
import type { Cache } from '../cache/index.js';
import type { ControllerContainer } from '../container/controller-container.js';
import type { RepositoryContainer } from '../container/repository-container.js';
import type { Database } from '../database/types.js';
import type { AuthSession } from './types.js';

export type RequestContext = {
  Variables: {
    db?: Database;
    auth?: Auth;
    cache?: Cache;
    controllers: ControllerContainer;
    repositories: RepositoryContainer;
    userId?: string;
    session?: AuthSession;
    permissionContext?: PermissionContext;
    permissionCheck?: PermissionCheck;
    requestId: string;
    locale: string;
    timezone: string;
  };
  Bindings: Record<string, string | undefined>;
};
