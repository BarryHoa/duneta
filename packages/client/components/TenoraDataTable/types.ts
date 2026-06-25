import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnOrderState,
  GroupingState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/react-table';
import type { SortDescriptor } from '@heroui/react';
import type { ReactNode } from 'react';
import type { TenoraDataTableFeature } from './feature';

export type TenoraDataTableEditType = 'text' | 'number' | 'date' | 'select';

export type TenoraDataTableSelectOption = {
  value: string;
  label: string;
};

export type TenoraDataTableColumnMeta = {
  thClassName?: string;
  tdClassName?: string;
  /** Freeze column left or right. */
  freeze?: 'left' | 'right';
  /** @deprecated use `freeze` */
  pin?: 'left' | 'right';
  editable?: boolean;
  editType?: TenoraDataTableEditType;
  editOptions?: readonly TenoraDataTableSelectOption[];
  filterPin?: boolean;
  width?: number;
  /** @deprecated use `width` */
  columnWidth?: number;
  minWidth?: number;
  maxWidth?: number | 'auto';
};

export type TenoraDataTableEmptyState = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export type TenoraDataTableFavoriteFilter = {
  id: string;
  label: string;
  columnFilters: ColumnFiltersState;
  globalFilter?: string;
  grouping?: GroupingState;
  columnVisibility?: VisibilityState;
  pinned?: boolean;
};

export type TenoraDataTableCellEdit<TData> = {
  rowId: string;
  columnId: string;
  row: TData;
  value: unknown;
};

export type TenoraDataTableEditingCell = {
  rowId: string;
  columnId: string;
} | null;

export type TenoraDataTableSearchConfig = {
  placeholder?: string;
  value?: string;
  initialValue?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  delay?: number;
  ariaLabel?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  refreshAria?: string;
  clearAria?: string;
  className?: string;
};

export type TenoraDataTablePaginationOffsetConfig = {
  mode?: 'offset';
  total: number;
  offset: number;
  limit?: number;
  onPageChange?: (nextOffset: number) => void;
  rangeLine?: string | null;
  previousLabel?: string;
  nextLabel?: string;
  isDisabled?: boolean;
};

export type TenoraDataTablePaginationClientConfig = {
  mode: 'client';
  pageSize?: number;
};

export type TenoraDataTablePaginationConfig =
  | TenoraDataTablePaginationOffsetConfig
  | TenoraDataTablePaginationClientConfig;

export type TenoraDataTableRowSelectionConfig = {
  type: 'checkbox' | 'radio';
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  /** Toggle all rows in a grouped section. */
  groupSelection?: boolean;
};

export type TenoraDataTableVirtualConfig = {
  rows?: boolean;
  columns?: boolean;
  estimatedRowHeight?: number;
  estimatedColumnWidth?: number;
  rowOverscan?: number;
  columnOverscan?: number;
};

export type TenoraDataTableFreezeConfig = {
  left?: string[];
  right?: string[];
  onChange?: (pinning: ColumnPinningState) => void;
  pinGroupedColumns?: boolean;
};

export type TenoraDataTableGroupingConfig = {
  columns: string[];
  onChange?: (columns: string[]) => void;
};

export type TenoraDataTableSortConfig = {
  descriptor?: SortDescriptor;
  onChange?: (sort: SortDescriptor) => void;
  manual?: boolean;
};

export type TenoraDataTableFilterConfig = {
  global?: string;
  onGlobalChange?: (value: string) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  pinnedColumnIds?: string[];
  manual?: boolean;
};

export type TenoraDataTableFavoritesConfig = {
  items?: TenoraDataTableFavoriteFilter[];
  onChange?: (items: TenoraDataTableFavoriteFilter[]) => void;
  storageKey?: string;
};

export type TenoraDataTableColumnsUiConfig = {
  showPanel?: boolean;
  minWidth?: number;
  maxWidth?: number | 'auto';
  defaultWidth?: number;
  resize?: boolean;
  drag?: boolean;
  order?: string[];
  onOrderChange?: (order: string[]) => void;
  visibility?: VisibilityState;
  onVisibilityChange?: (visibility: VisibilityState) => void;
};

export type TenoraDataTableEditConfig<TData> = {
  cell?: TenoraDataTableEditingCell;
  onCellChange?: (cell: TenoraDataTableEditingCell) => void;
  onCellEdit?: (edit: TenoraDataTableCellEdit<TData>) => void | Promise<void>;
};

export type TenoraDataTableRetryConfig = {
  onRetry?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  refreshLabel?: string;
};

export type TenoraDataTableErrorConfig = {
  onRetry?: () => void;
};

export type TenoraDataTableProps<TData> = {
  data: TData[];
  columns: Array<ColumnDef<TData, unknown>>;
  getRowId?: (row: TData, index: number) => string;

  ariaLabel?: string;
  /** Unique id per table instance (`useId` when omitted). Used for radio selection groups. */
  instanceId?: string;
  className?: string;
  contentMaxHeight?: string;
  toolbar?: ReactNode;

  loading?: boolean;
  error?: TenoraDataTableFeature<TenoraDataTableErrorConfig>;
  empty?: TenoraDataTableEmptyState;

  search?: TenoraDataTableFeature<TenoraDataTableSearchConfig>;
  pagination?: TenoraDataTableFeature<TenoraDataTablePaginationConfig>;
  rowSelection?: TenoraDataTableFeature<TenoraDataTableRowSelectionConfig>;
  virtual?: TenoraDataTableFeature<TenoraDataTableVirtualConfig>;
  freeze?: TenoraDataTableFeature<TenoraDataTableFreezeConfig>;
  grouping?: TenoraDataTableFeature<TenoraDataTableGroupingConfig>;
  sort?: TenoraDataTableFeature<TenoraDataTableSortConfig>;
  filter?: TenoraDataTableFeature<TenoraDataTableFilterConfig>;
  favorites?: TenoraDataTableFeature<TenoraDataTableFavoritesConfig>;
  columnsUi?: TenoraDataTableFeature<TenoraDataTableColumnsUiConfig>;
  edit?: TenoraDataTableFeature<TenoraDataTableEditConfig<TData>>;
  retry?: TenoraDataTableFeature<TenoraDataTableRetryConfig>;

  table?: Table<TData>;
};

export type UseTenoraDataTableOptions<TData> = {
  data: TData[];
  columns: Array<ColumnDef<TData, unknown>>;
  getRowId?: (row: TData, index: number) => string;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (sort: SortDescriptor) => void;
  manualSorting?: boolean;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  manualFiltering?: boolean;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: (pinning: ColumnPinningState) => void;
  grouping?: GroupingState;
  onGroupingChange?: (grouping: GroupingState) => void;
  pinGroupedColumns?: boolean;
  clientPagination?: false | { pageSize?: number };
  rowSelectionConfig?: TenoraDataTableRowSelectionConfig;
  instanceId?: string;
  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: (order: ColumnOrderState) => void;
  enableColumnResize?: boolean;
  columnSizingDefaults?: {
    minWidth?: number;
    maxWidth?: number | 'auto';
    defaultWidth?: number;
  };
};

export type TenoraDataTableState = {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  columnPinning: ColumnPinningState;
  columnOrder: ColumnOrderState;
  grouping: GroupingState;
  globalFilter: string;
  pagination: PaginationState;
  rowSelection: RowSelectionState;
};

export const TENORA_DATA_TABLE_SELECTION_COLUMN_ID = '__tenora_select';
export const TENORA_DATA_TABLE_DEFAULT_MIN_WIDTH = 80;

/** @deprecated use grouped `pagination` config */
export type TenoraDataTablePagination = TenoraDataTablePaginationOffsetConfig;

export type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  GroupingState,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
};

export type { TenoraDataTableFeature } from './feature';
