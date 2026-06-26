export { createDefaultConfig } from './defaults';
export { defineDunetaConfig, loadConfig, toServerConfig, toWebConfig } from './load';
export { mergeConfig, type DeepPartial } from './merge';
export { config, commitConfig, getConfig } from './registry';
export type { DunetaConfig } from './duneta';
export type { DunetaWebConfig, ThemeMode } from './types';
