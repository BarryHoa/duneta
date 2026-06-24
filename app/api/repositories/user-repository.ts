import { BaseRepository } from '@tenora/server/http';
import type { Database } from '@tenora/server/database';
import { user } from '@tenora/server/repositories';

export class UserRepository extends BaseRepository<typeof user> {
  constructor(db: Database) {
    super(db, user);
  }
}
