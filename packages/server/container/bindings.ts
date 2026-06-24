import type { ControllerContainer } from './controller-container.js';
import type { RepositoryContainer } from './repository-container.js';
import type { BindingContext, RegisterBindings } from './types.js';
import type { Database } from '../database/types.js';
import { HealthController, MeController, UserController } from '../http/controllers/index.js';
import { UserRepository } from '../repositories/user-repository.js';

export function registerDefaultRepositories(
  repositories: RepositoryContainer,
  db: Database | null,
): void {
  if (!db) return;

  const users = new UserRepository(db);
  repositories.singleton('UserRepository', () => users);
}

export function registerDefaultControllers(
  controllers: ControllerContainer,
  repositories: RepositoryContainer,
): void {
  controllers.singleton('HealthController', () => new HealthController());
  controllers.singleton('MeController', () => new MeController());

  if (repositories.has('UserRepository')) {
    controllers.singleton(
      'UserController',
      () => new UserController(repositories.resolve('UserRepository')),
    );
  }
}

export function registerDefaultBindings(ctx: BindingContext): void {
  registerDefaultRepositories(ctx.repositories, ctx.db);
  registerDefaultControllers(ctx.controllers, ctx.repositories);
}

export const defaultRegisterBindings: RegisterBindings = (ctx) => {
  registerDefaultBindings(ctx);
};
