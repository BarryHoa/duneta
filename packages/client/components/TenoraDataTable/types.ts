import type { ColumnDef } from '@tanstack/react-table';
import type { TenoraTableProps } from '../TenoraTable/types';
import type { ColumnDragConfig } from './core/column-drag';
import type { ColumnResizeConfig } from './core/column-resize';

export type TenoraDataTablePaginationConfig = {
  total: number;
  pageSize: number;
  /** 1-based page index */
  page: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export type TenoraDataTableProps<TData extends object> = {
  columns: Array<ColumnDef<TData, unknown>>;
  data: TData[];
  pagination?: false | TenoraDataTablePaginationConfig;
  getRowId?: (row: TData, index: number) => string;
  ariaLabel?: string;
  className?: string;
  /**
   * HeroUI table shell variant. `primary` uses large ~32px card radius;
   * `secondary` is flatter. Default: `secondary`.
   */
  variant?: TenoraTableProps['variant'];
  /** Enable row virtualization when pagination is disabled. Default: false */
  virtual?: boolean;
  /**
   * Column reorder via drag.
   * - `true` — all columns draggable
   * - `false` / `null` / omitted — no drag
   * - `string[]` — only listed column ids are draggable
   */
  columnDrag?: ColumnDragConfig;
  /**
   * Column resize via drag handle on the header edge.
   * - `true` — all columns resizable
   * - `false` / `null` / omitted — no resize
   * - `string[]` — only listed column ids are resizable
   *
   * Per-column `meta.defaultWidth`, `meta.minWidth`, `meta.maxWidth` control sizing.
   */
  columnResize?: ColumnResizeConfig;
  /** Max height of the scrollable table body (`tbody`). Header and pagination footer stay fixed. */
  height?: number | string;
};

export type { ColumnDef };
export type { ColumnDragConfig } from './core/column-drag';
export type { ColumnResizeConfig } from './core/column-resize';
export type {
  ColumnDefaultWidth,
  ColumnMaxWidth,
  ColumnWidthValue,
  TenoraDataTableColumnMeta,
} from './types/column-meta';
