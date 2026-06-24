import { eq } from 'drizzle-orm';
import { BaseRepository } from '../http/base-repository.js';
import type { Database } from '../database/types.js';
import { user } from './schemas/auth.js';

export class UserRepository extends BaseRepository<typeof user> {
  constructor(db: Database) {
    super(db, user);
  }

  findByEmail(email: string) {
    return this.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1)
      .then((rows) => rows[0] ?? null);
  }
}
