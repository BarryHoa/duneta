/** Per-column feature toggle: all, none, or an allowlist of column ids. */
export type ColumnFeatureConfig =
  | true
  | false
  | null
  | undefined
  | readonly string[];

export function isColumnFeatureEnabled(
  config: ColumnFeatureConfig,
): boolean {
  if (config === true) return true;
  if (config === false || config == null) return false;
  if (Array.isArray(config)) return config.length > 0;
  return false;
}

export function isColumnFeatureAllowed(
  config: ColumnFeatureConfig,
  columnId: string,
): boolean {
  if (config === true) return true;
  if (config === false || config == null) return false;
  if (Array.isArray(config)) return config.includes(columnId);
  return false;
}
