import { isAuthEnabled, isDatabaseEnabled } from '@tenora/server/configs';
import type { RegisterServices } from '@tenora/server/container';
import { HealthController, MeController, UserController } from '@tenora/server/http';
import { UserRepository } from '@tenora/server/repositories';

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
