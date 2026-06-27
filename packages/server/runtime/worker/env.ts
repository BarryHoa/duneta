/** Wrangler `env` — bindings + secrets (string values). */
export type WorkerEnv = Record<string, unknown>;

/**
 * Optional bridge for string bindings before server config loads.
 * With `nodejs_compat_populate_process_env`, Wrangler secrets usually appear in `process.env` lazily.
 * Only sets keys not already present (shell / prior values win).
 */
export function bridgeWorkerEnv(env: WorkerEnv): void {
  for (const [key, value] of Object.entries(env)) {
    if (typeof value !== 'string' || value.length === 0) continue;
    if (process.env[key] !== undefined) continue;
    process.env[key] = value;
  }
}
