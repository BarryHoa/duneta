import type { RegisterBindings } from '@tenora/server/container';
import { registerDefaultBindings } from '@tenora/server/container';

export const registerProviders: RegisterBindings = (ctx) => {
  registerDefaultBindings(ctx);
};
