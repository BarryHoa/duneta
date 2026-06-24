type Factory<T> = () => T;

export class Container {
  private readonly factories = new Map<string, Factory<unknown>>();
  private readonly instances = new Map<string, unknown>();

  singleton<T>(key: string, factory: Factory<T>): this {
    this.factories.set(key, factory as Factory<unknown>);
    return this;
  }

  has(key: string): boolean {
    return this.factories.has(key);
  }

  resolve<T>(key: string): T {
    const factory = this.factories.get(key);
    if (!factory) throw new Error(`No binding registered for "${key}".`);

    if (!this.instances.has(key)) {
      this.instances.set(key, factory());
    }
    return this.instances.get(key) as T;
  }
}

export function createContainer(): Container {
  return new Container();
}
