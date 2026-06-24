import type { Container } from '@tenora/server/container';
import type { Database } from '@tenora/server/database';
import { registerDefaultBindings, type TenoraProvider } from '@tenora/server/providers';

export function registerBindings(container: Container, db: Database | null) {
  registerDefaultBindings(container, db);
}

export const providers: TenoraProvider[] = [];
