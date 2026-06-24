import type { Container } from '@tenora/server/container';
import type { Database } from '@tenora/server/database';
import type { TenoraProvider } from '@tenora/server/providers';
import { HealthController } from '../controllers/health-controller.js';
import { MeController } from '../controllers/me-controller.js';
import { UserController } from '../controllers/user-controller.js';
import { UserRepository } from '../repositories/user-repository.js';

export function registerBindings(container: Container, db: Database | null) {
  container.singleton('HealthController', () => new HealthController());
  container.singleton('MeController', () => new MeController());

  if (!db) return;

  const users = new UserRepository(db);
  container.singleton('UserRepository', () => users);
  container.singleton('UserController', () => new UserController(users));
}

export const providers: TenoraProvider[] = [];
