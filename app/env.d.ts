import type { PlatformEnv } from '../packages/server/runtime/shared/platform-env';

type AssetsBinding = {
  fetch: typeof fetch;
};

declare global {
  interface Env extends PlatformEnv {
    ASSETS?: AssetsBinding;
  }
}

export {};
