import { isAuthEnabled, isDatabaseEnabled } from '@duneta/server/configs';
import type { RegisterServices } from '@duneta/server/container';
import { HealthController, MeController, UserController } from '@duneta/server/http';
import { UserRepository } from '@duneta/server/repositories';

export const registerServices: RegisterServices = ({
  controllers,
  repositories,
  db,
  config,
}) => {
  controllers.singleton('HealthController', () => new HealthController());

  if (isAuthEnabled(config)) {
    controllers.singleton('MeController', () => new MeController());
  }

  if (isDatabaseEnabled(config) && db) {
    repositories.singleton('UserRepository', () => new UserRepository(db));
    controllers.singleton(
      'UserController',
      () => new UserController(repositories.resolve('UserRepository')),
    );
  }
};
