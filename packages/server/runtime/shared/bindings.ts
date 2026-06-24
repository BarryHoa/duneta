/** Cloudflare Hyperdrive binding — see wrangler `hyperdrive` config. */
export type HyperdriveBinding = {
  connectionString: string;
};

/** Platform `env` — wrangler vars, secrets, and bindings (optional on Node). */
export type RuntimeBindings = Record<string, string | HyperdriveBinding | undefined>;

export function isHyperdriveBinding(value: unknown): value is HyperdriveBinding {
  return (
    typeof value === 'object' &&
    value !== null &&
    'connectionString' in value &&
    typeof (value as HyperdriveBinding).connectionString === 'string'
  );
}
