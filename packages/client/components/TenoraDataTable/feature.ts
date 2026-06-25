/** `false` | `null` | `undefined` disables the feature. */
export type TenoraDataTableFeature<T> = false | null | undefined | T;

export function isTenoraDataTableFeatureEnabled<T>(
  feature: TenoraDataTableFeature<T>,
): feature is T {
  return feature != null && feature !== false;
}
