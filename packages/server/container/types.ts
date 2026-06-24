import type { ControllerContainer } from './controller-container.js';
import type { RepositoryContainer } from './repository-container.js';
import type { Database } from '../database/types.js';
import type { TenoraServerConfig } from '../configs/types.js';

export type BindingContext = {
  controllers: ControllerContainer;
  repositories: RepositoryContainer;
  db: Database | null;
  config: TenoraServerConfig;
};

export type RegisterBindings = (ctx: BindingContext) => void;
