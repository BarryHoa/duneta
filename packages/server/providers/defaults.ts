import type { Container } from '../container/index.js';
import type { Database } from '../database/types.js';
import { HealthController, MeController, UserController } from '../http/controllers/index.js';
import { UserRepository } from '../repositories/user-repository.js';

export function registerDefaultBindings(container: Container, db: Database | null) {
  container.singleton('HealthController', () => new HealthController());
  container.singleton('MeController', () => new MeController());

  if (!db) return;

  const users = new UserRepository(db);
  container.singleton('UserRepository', () => users);
  container.singleton('UserController', () => new UserController(users));
}
