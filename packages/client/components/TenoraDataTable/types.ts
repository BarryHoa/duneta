import type { ColumnDef } from '@tanstack/react-table';

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
  /** Enable row virtualization when pagination is disabled. Default: true */
  virtual?: boolean;
  /** Enable drag-to-reorder columns. Default: true */
  columnDrag?: boolean;
  /** Scroll container height when virtual rows are enabled */
  height?: number | string;
};

export type { ColumnDef };
