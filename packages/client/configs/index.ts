export { IMAGE_OPTIMIZATION_PATH } from './image-path.js';
export { createDefaultConfig } from './defaults';
export { CLIENT_CONFIG_FILENAME, defineClientConfig, loadConfig, toWebConfig } from './load';
export { mergeConfig, type DeepPartial } from './merge';
export { config, getConfig } from './registry';
export type { DunetaClientConfig } from './duneta';
export type { DunetaWebConfig, ImageConfig, ThemeMode } from './types';
