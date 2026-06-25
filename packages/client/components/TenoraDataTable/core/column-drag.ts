import type { ColumnFeatureConfig } from './column-feature';
import {
  isColumnFeatureAllowed,
  isColumnFeatureEnabled,
} from './column-feature';

/** @deprecated Use {@link ColumnFeatureConfig} */
export type ColumnDragConfig = ColumnFeatureConfig;

export const isColumnDragEnabled = isColumnFeatureEnabled;
export const isColumnDraggable = isColumnFeatureAllowed;
