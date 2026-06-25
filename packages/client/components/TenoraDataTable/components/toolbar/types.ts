import type { Table as ReactTable } from '@tanstack/react-table';
import type {
  DataTableColumnResetHandlers,
  ResolvedTenoraDataTableToolbarConfig,
} from '../../types/toolbar';

export type ToolbarColumnOption = {
  id: string;
  label: string;
};

export type DataTableToolbarProps<TData extends object> = {
  table: ReactTable<TData>;
  config: ResolvedTenoraDataTableToolbarConfig;
  groupingColumnId: string | null;
  onGroupingChange: (columnId: string | null) => void;
  onSearchChange: (query: string) => void;
  columnReset: DataTableColumnResetHandlers;
  showRefresh?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};
