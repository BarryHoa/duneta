import type { CSSProperties } from 'react';
import type { Column } from '@tanstack/react-table';
import type { TenoraDataTableColumnMeta } from './types';
import { TENORA_DATA_TABLE_DEFAULT_MIN_WIDTH } from './types';

export const TENORA_DATA_TABLE_DEFAULT_COLUMN_WIDTH = 120;

export type TenoraDataTableColumnSizing = {
  width: number;
  minWidth: number;
  maxWidth: number | undefined;
};

export function resolveTenoraDataTableColumnSizing<TData>(
  column: Column<TData, unknown>,
  defaults: {
    minWidth?: number;
    maxWidth?: number | 'auto';
    defaultWidth?: number;
  } = {},
): TenoraDataTableColumnSizing {
  const meta = column.columnDef.meta as TenoraDataTableColumnMeta | undefined;
  const width =
    meta?.width ??
    meta?.columnWidth ??
    column.getSize() ??
    defaults.defaultWidth ??
    TENORA_DATA_TABLE_DEFAULT_COLUMN_WIDTH;
  const minWidth =
    meta?.minWidth ?? column.columnDef.minSize ?? defaults.minWidth ?? TENORA_DATA_TABLE_DEFAULT_MIN_WIDTH;
  const maxRaw = meta?.maxWidth ?? column.columnDef.maxSize ?? defaults.maxWidth ?? 'auto';
  const maxWidth = maxRaw === 'auto' || maxRaw == null ? undefined : maxRaw;
  return { width, minWidth, maxWidth };
}

export function columnSizingStyle(sizing: TenoraDataTableColumnSizing): CSSProperties {
  return {
    width: sizing.width,
    minWidth: sizing.minWidth,
    ...(sizing.maxWidth != null ? { maxWidth: sizing.maxWidth } : {}),
  };
}

export function getTenoraDataTableColumnWidth<TData>(column: Column<TData, unknown>) {
  return resolveTenoraDataTableColumnSizing(column).width;
}
