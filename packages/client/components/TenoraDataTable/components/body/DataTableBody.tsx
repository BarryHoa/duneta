'use client';

import { flexRender, type Row, type Table as ReactTable } from '@tanstack/react-table';
import { cn } from '../../../../helpers';
import { getColumnPinPresentation } from '../../core/columns';
import { isSelectionColumnId } from '../../core/row-selection';
import { SELECTION_COLUMN_CLASS } from '../../constants';
import { TenoraTable } from '../../../TenoraTable';
import type { TenoraDataTableProps } from '../../types';
import { DataTableEmptyState } from './DataTableEmptyState';

type DataTableRowProps<TData> = {
  row: Row<TData>;
  table: ReactTable<TData>;
  columnCount: number;
  pinEnabled: boolean;
};

function DataTableRow<TData>({
  row,
  table,
  columnCount,
  pinEnabled,
}: DataTableRowProps<TData>) {
  if (row.getIsGrouped()) {
    const groupValue = row.getValue(row.groupingColumnId ?? '');
    return (
      <TenoraTable.Row key={row.id} id={row.id}>
        <TenoraTable.Cell
          className="bg-surface-tertiary font-medium text-foreground"
          colSpan={columnCount}
        >
          {String(groupValue ?? '')}
          <span className="ml-2 text-xs font-normal text-muted">
            ({row.subRows.length})
          </span>
        </TenoraTable.Cell>
      </TenoraTable.Row>
    );
  }

  return (
    <TenoraTable.Row key={row.id} id={row.id}>
      {row.getVisibleCells().map((cell) => {
        const pin = pinEnabled
          ? getColumnPinPresentation(cell.column, table, 'body')
          : { className: '', style: {} };

        return (
          <TenoraTable.Cell
            key={cell.id}
            className={cn(
              isSelectionColumnId(cell.column.id) && SELECTION_COLUMN_CLASS,
              pin.className,
            )}
            style={pin.style}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TenoraTable.Cell>
        );
      })}
    </TenoraTable.Row>
  );
}

type DataTableStaticBodyProps<TData> = {
  table: ReactTable<TData>;
  columnCount: number;
  pinEnabled: boolean;
};

export function DataTableStaticBody<TData>({
  table,
  columnCount,
  pinEnabled,
}: DataTableStaticBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <TenoraTable.Body
      renderEmptyState={() => <DataTableEmptyState columnCount={columnCount} />}
    >
      {rows.map((row) => (
        <DataTableRow
          key={row.id}
          columnCount={columnCount}
          pinEnabled={pinEnabled}
          row={row}
          table={table}
        />
      ))}
    </TenoraTable.Body>
  );
}

type DataTableVirtualBodyProps<TData extends object> = {
  table: ReactTable<TData>;
  data: TData[];
  getRowId?: TenoraDataTableProps<TData>['getRowId'];
  columnCount: number;
  pinEnabled: boolean;
};

export function DataTableVirtualBody<TData extends object>({
  table,
  data,
  getRowId,
  columnCount,
  pinEnabled,
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
            {row.getVisibleCells().map((cell) => {
              const pin = pinEnabled
                ? getColumnPinPresentation(cell.column, table, 'body')
                : { className: '', style: {} };

              return (
                <TenoraTable.Cell
                  key={cell.id}
                  className={cn(
                    isSelectionColumnId(cell.column.id) && SELECTION_COLUMN_CLASS,
                    pin.className,
                  )}
                  style={pin.style}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TenoraTable.Cell>
              );
            })}
          </TenoraTable.Row>
        );
      }}
    </TenoraTable.Body>
  );
}
