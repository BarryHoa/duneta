'use client';

import { flexRender, type Table as ReactTable } from '@tanstack/react-table';
import { TenoraTable } from '../../../TenoraTable';
import type { TenoraDataTableProps } from '../../types';
import { DataTableEmptyState } from './DataTableEmptyState';

type DataTableStaticBodyProps<TData> = {
  table: ReactTable<TData>;
  columnCount: number;
};

export function DataTableStaticBody<TData>({
  table,
  columnCount,
}: DataTableStaticBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <TenoraTable.Body
      renderEmptyState={() => <DataTableEmptyState columnCount={columnCount} />}
    >
      {rows.map((row) => (
        <TenoraTable.Row key={row.id} id={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TenoraTable.Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TenoraTable.Cell>
          ))}
        </TenoraTable.Row>
      ))}
    </TenoraTable.Body>
  );
}

type DataTableVirtualBodyProps<TData extends object> = {
  table: ReactTable<TData>;
  data: TData[];
  getRowId?: TenoraDataTableProps<TData>['getRowId'];
  columnCount: number;
};

export function DataTableVirtualBody<TData extends object>({
  table,
  data,
  getRowId,
  columnCount,
}: DataTableVirtualBodyProps<TData>) {
  const rowsById = table.getRowModel().rowsById;

  return (
    <TenoraTable.Body
      items={data}
      dependencies={[data]}
      renderEmptyState={() => <DataTableEmptyState columnCount={columnCount} />}
    >
      {(item) => {
        const typedItem = item as TData;
        const index = data.indexOf(typedItem);
        const rowId = getRowId
          ? getRowId(typedItem, index >= 0 ? index : 0)
          : (typedItem as { id?: string }).id;
        const row = rowId ? rowsById[rowId] : undefined;
        if (!row) return null;

        return (
          <TenoraTable.Row id={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TenoraTable.Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TenoraTable.Cell>
            ))}
          </TenoraTable.Row>
        );
      }}
    </TenoraTable.Body>
  );
}
