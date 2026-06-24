/** Cloudflare Hyperdrive binding — see wrangler `hyperdrive` config. */
export type HyperdriveBinding = {
  connectionString: string;
};

/**
 * Worker `env` / Hono bindings passed into `handleWorkerFetch`.
 * String values map to wrangler vars and secrets; `HYPERDRIVE` is a binding object.
 */
export type RuntimeBindings = Record<string, string | HyperdriveBinding | undefined>;

export function isHyperdriveBinding(value: unknown): value is HyperdriveBinding {
  return (
    typeof value === 'object' &&
    value !== null &&
    'connectionString' in value &&
    typeof (value as HyperdriveBinding).connectionString === 'string'
  );
}
