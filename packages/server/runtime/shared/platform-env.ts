export type HyperdriveBinding = {
  connectionString: string;
};

export type FetcherBinding = {
  fetch: typeof fetch;
};

/** Cloudflare Worker `env` — secrets, vars, bindings (optional on Node). */
export type PlatformEnv = Record<string, string | HyperdriveBinding | FetcherBinding | undefined>;

export function isHyperdriveBinding(value: unknown): value is HyperdriveBinding {
  return (
    typeof value === 'object' &&
    value !== null &&
    'connectionString' in value &&
    typeof (value as HyperdriveBinding).connectionString === 'string'
  );
}
