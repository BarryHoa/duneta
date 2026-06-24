import type { Context } from 'hono';
import { BaseController } from '@tenora/server/http';
import type { BackendEnv } from '@tenora/server/middlewares';
import type { UserRepository } from '../repositories/user-repository.js';

export class UserController extends BaseController {
  constructor(private readonly users: UserRepository) {
    super();
  }

  index = async (c: Context<BackendEnv>) => {
    return this.json(c, { data: await this.users.findAll() });
  };

  show = async (c: Context<BackendEnv>) => {
    const id = c.req.param('id');
    if (!id) return this.notFound(c);
    const user = await this.users.findById(id);
    if (!user) return this.notFound(c, 'User not found');
    return this.json(c, { data: user });
  };
}
