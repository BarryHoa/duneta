import type { Context } from 'hono';
import type { BackendEnv } from '../../middlewares/env.js';
import { BasePolicy } from '../policy.js';

export class UserPolicy extends BasePolicy {
  static list(c: Context<BackendEnv>) {
    this.assertAny(c, ['users.read', 'users.*', '*']);
  }

  static view(c: Context<BackendEnv>, user: { id: string }) {
    const subject = { type: 'user', id: user.id, ownerId: user.id };
    this.assertAny(c, ['users.read', 'users.*', '*', 'users.read:self'], subject);
  }
}
