export { createDefaultConfig } from './defaults';
export {
  CLIENT_CONFIG_FILENAME,
  defineClientConfig,
  defineServerConfig,
  loadConfig,
  toWebConfig,
} from './load';
export { mergeConfig, type DeepPartial } from './merge';
export { config, getConfig } from './registry';
export type {
  DunetaClientConfig,
  DunetaServerConfigFile,
} from './duneta';
export type { DunetaWebConfig, ThemeMode } from './types';
