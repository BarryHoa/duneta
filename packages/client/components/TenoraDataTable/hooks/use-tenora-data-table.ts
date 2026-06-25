'use client';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  type SortingState,
  type Table as ReactTable,
} from '@tanstack/react-table';
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  createInitialColumnOrder,
  createInitialColumnPinning,
  withTanStackColumnSizing,
} from '../core/columns';
import { toSortDescriptor } from '../core/sort';
import type { TenoraDataTableProps } from '../types';

export type UseTenoraDataTableOptions<TData extends object> = {
  columns: Array<ColumnDef<TData, unknown>>;
  data: TData[];
  getRowId?: TenoraDataTableProps<TData>['getRowId'];
  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: (order: ColumnOrderState) => void;
};

export function useTenoraDataTable<TData extends object>({
  columns,
  data,
  getRowId,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange,
}: UseTenoraDataTableOptions<TData>): {
  table: ReactTable<TData>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  columnOrder: ColumnOrderState;
  setColumnOrder: Dispatch<SetStateAction<ColumnOrderState>>;
  sortDescriptor: ReturnType<typeof toSortDescriptor>;
} {
  const [sorting, setSorting] = useState<SortingState>([]);

  const sizedColumns = useMemo(
    () => withTanStackColumnSizing(columns),
    [columns],
  );

  const columnPinningFromMeta = useMemo(
    () => createInitialColumnPinning(sizedColumns),
    [sizedColumns],
  );

  const columnOrderFromMeta = useMemo(
    () => createInitialColumnOrder(sizedColumns, columnPinningFromMeta),
    [sizedColumns, columnPinningFromMeta],
  );

  const [columnPinning, setColumnPinning] =
    useState<ColumnPinningState>(columnPinningFromMeta);
  const [internalColumnOrder, setInternalColumnOrder] =
    useState<ColumnOrderState>(columnOrderFromMeta);

  useEffect(() => {
    setColumnPinning(columnPinningFromMeta);
    setInternalColumnOrder(columnOrderFromMeta);
  }, [columnPinningFromMeta, columnOrderFromMeta]);

  const columnOrder = controlledColumnOrder ?? internalColumnOrder;

  const setColumnOrder: Dispatch<SetStateAction<ColumnOrderState>> = (
    value,
  ) => {
    const next =
      typeof value === 'function' ? value(columnOrder) : value;
    if (onColumnOrderChange) {
      onColumnOrderChange(next);
      return;
    }
    setInternalColumnOrder(next);
  };

  const table = useReactTable({
    columns: sizedColumns,
    data,
    getRowId,
    enableColumnPinning: true,
    initialState: {
      columnPinning: columnPinningFromMeta,
      columnOrder: columnOrderFromMeta,
    },
    state: { sorting, columnOrder, columnPinning },
    onSortingChange: setSorting,
    onColumnOrderChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(columnOrder) : updater;
      setColumnOrder(next);
    },
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);

  return {
    table,
    sorting,
    setSorting,
    columnOrder,
    setColumnOrder,
    sortDescriptor,
  };
}
