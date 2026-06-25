import type { ColumnFeatureConfig } from './column-feature';
import {
  isColumnFeatureAllowed,
  isColumnFeatureEnabled,
} from './column-feature';

export type ColumnResizeConfig = ColumnFeatureConfig;

export const isColumnResizeEnabled = isColumnFeatureEnabled;
export const isColumnResizable = isColumnFeatureAllowed;
