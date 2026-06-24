import { Container } from './container.js';

/** DI container for controllers — separate from repositories and infra. */
export class ControllerContainer {
  private readonly inner = new Container();

  singleton<T>(key: string, factory: () => T): this {
    this.inner.singleton(key, factory);
    return this;
  }

  has(key: string): boolean {
    return this.inner.has(key);
  }

  resolve<T>(key: string): T {
    return this.inner.resolve<T>(key);
  }
}

export function createControllerContainer(): ControllerContainer {
  return new ControllerContainer();
}
