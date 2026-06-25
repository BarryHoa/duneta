import type { Header, Table as ReactTable } from '@tanstack/react-table';

export type DataTableEngineState<TData extends object> = {
  table: ReactTable<TData>;
  headers: Array<Header<TData, unknown>>;
  columnCount: number;
  rows: ReturnType<ReactTable<TData>['getRowModel']>['rows'];
};

export function getDataTableEngineState<TData extends object>(
  table: ReactTable<TData>,
): DataTableEngineState<TData> {
  const headers = table.getHeaderGroups()[0]?.headers ?? [];
  return {
    table,
    headers,
    columnCount: headers.length,
    rows: table.getRowModel().rows,
  };
}
