'use client';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type SortingState,
  type Table as ReactTable,
} from '@tanstack/react-table';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { TenoraDataTableProps } from '../types';
import { createInitialColumnOrder } from './column-order';
import { toSortDescriptor } from './sort-bridge';

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
  const [internalColumnOrder, setInternalColumnOrder] = useState<ColumnOrderState>(
    () => createInitialColumnOrder(columns),
  );

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
    columns,
    data,
    getRowId,
    state: { sorting, columnOrder },
    onSortingChange: setSorting,
    onColumnOrderChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(columnOrder) : updater;
      setColumnOrder(next);
    },
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
