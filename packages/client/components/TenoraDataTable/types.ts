import type { ColumnDef, ColumnPinningState } from '@tanstack/react-table';
import type { SortDescriptor } from '@heroui/react';
import type { TenoraTableProps } from '../TenoraTable/types';
import type { ColumnDragConfig, ColumnResizeConfig } from './core/columns';

export type TenoraDataTableDataType = 'static' | 'dynamic';

/** `false` / `null` / omitted disables row selection. Selection is scoped to the current page. */
export type TenoraDataTableRowSelectionConfig = {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  /** When grouping is enabled, toggle all rows in a group. */
  groupSelection?: boolean;
};

export type TenoraDataTableSortConfig = {
  descriptor?: SortDescriptor;
  onChange: (descriptor: SortDescriptor) => void;
};

export type TenoraDataTablePaginationConfig = {
  /**
   * Total row count for pagination UI.
   * Required for `dataType="dynamic"` (server total).
   * Ignored for `dataType="static"` — derived from `data.length`.
   */
  total?: number;
  pageSize: number;
  /** 1-based page index */
  page: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export type TenoraDataTableProps<TData extends object> = {
  columns: Array<ColumnDef<TData, unknown>>;
  /** All rows for `static`; current server page for `dynamic`. */
  data: TData[];
  /**
   * `static` — client sort + pagination over full `data`.
   * `dynamic` (default) — server sort + pagination; render every row in `data` as-is.
   */
  dataType?: TenoraDataTableDataType;
  pagination?: false | TenoraDataTablePaginationConfig;
  /** Required when `dataType="dynamic"` and columns are sortable. */
  sort?: TenoraDataTableSortConfig;
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
  /**
   * Row selection via checkbox column (pinned left). Scoped to the current page.
   * Requires stable row ids — pass `getRowId` when rows lack an `id` field.
   */
  rowSelection?: false | null | TenoraDataTableRowSelectionConfig;
  /** Max height of the scrollable table body (`tbody`). Header and pagination footer stay fixed. */
  height?: number | string;
};

export type { ColumnDef };
export type { ColumnDragConfig, ColumnResizeConfig, ColumnPinningState };
export type {
  ColumnDefaultWidth,
  ColumnMaxWidth,
  ColumnWidthValue,
  TenoraDataTableColumnMeta,
} from './types/column-meta';
