import { config } from '../configs/registry.js';
import type { LocaleConfig } from '../configs/types.js';

export type DunetaLocale = string;

export function getLocaleConfig(): LocaleConfig {
  return config.locale;
}

export function getDefaultLocale(): string {
  return config.locale.default;
}

export function getSupportedLocales(): string[] {
  return config.locale.supported;
}
