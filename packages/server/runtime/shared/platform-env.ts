export type HyperdriveBinding = {
  connectionString: string;
};

/** Cloudflare Worker `env` — secrets, vars, Hyperdrive (optional on Node). */
export type PlatformEnv = Record<string, string | HyperdriveBinding | undefined>;

export function isHyperdriveBinding(value: unknown): value is HyperdriveBinding {
  return (
    typeof value === 'object' &&
    value !== null &&
    'connectionString' in value &&
    typeof (value as HyperdriveBinding).connectionString === 'string'
  );
}
