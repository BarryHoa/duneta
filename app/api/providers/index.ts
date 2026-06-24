import { isAuthEnabled, isDatabaseEnabled } from '@tenora/server/configs';
import type { RegisterBindings } from '@tenora/server/container';
import { HealthController, MeController, UserController } from '@tenora/server/http';
import { UserRepository } from '@tenora/server/repositories';

// import { PostRepository } from '../repositories/post-repository';
// import { PostController } from '../controllers/post-controller';

export const registerProviders: RegisterBindings = ({
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

  // if (!db) return;
  // repositories.singleton('PostRepository', () => new PostRepository(db));
  // controllers.singleton(
  //   'PostController',
  //   () => new PostController(repositories.resolve('PostRepository')),
  // );
};
