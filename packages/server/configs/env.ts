/** Read an environment variable with an optional fallback (Laravel `env()` equivalent). */
export function env(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value !== undefined && value !== '') return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${key}`);
}

/** First non-empty value from `keys`, or `fallback`. */
export function envFirst(keys: string[], fallback?: string): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value !== undefined && value !== '') return value;
  }
  return fallback;
}

/** Parse a boolean env var (`true` / `1` / `yes` / `on`). */
export function envBool(key: string, fallback: boolean): boolean {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
