
import { flexRender, type Row, type Table as ReactTable } from '@tanstack/react-table';
import { cn } from '../../../../core/cn.js';
import { getColumnPinPresentation } from '../../core/columns';
import { isSelectionColumnId } from '../../core/row-selection';
import { SELECTION_COLUMN_CLASS } from '../../constants';
import { DunetaTable } from '../../../DunetaTable';
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
      <DunetaTable.Row key={row.id} id={row.id}>
        <DunetaTable.Cell
          className="bg-surface-tertiary font-medium text-foreground"
          colSpan={columnCount}
        >
          {String(groupValue ?? '')}
          <span className="ml-2 text-xs font-normal text-muted">
            ({row.subRows.length})
          </span>
        </DunetaTable.Cell>
      </DunetaTable.Row>
    );
  }

  return (
    <DunetaTable.Row key={row.id} id={row.id}>
      {row.getVisibleCells().map((cell) => {
        const pin = pinEnabled
          ? getColumnPinPresentation(cell.column, table, 'body')
          : { className: '', style: {} };

        return (
          <DunetaTable.Cell
            key={cell.id}
            className={cn(
              isSelectionColumnId(cell.column.id) && SELECTION_COLUMN_CLASS,
              pin.className,
            )}
            style={pin.style}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DunetaTable.Cell>
        );
      })}
    </DunetaTable.Row>
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
    <DunetaTable.Body
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
    </DunetaTable.Body>
  );
}

type DataTableVirtualBodyProps<TData extends object> = {
  table: ReactTable<TData>;
  columnCount: number;
  pinEnabled: boolean;
};

export function DataTableVirtualBody<TData extends object>({
  table,
  columnCount,
  pinEnabled,
}: DataTableVirtualBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <DunetaTable.Body
      items={rows}
      dependencies={[rows]}
      renderEmptyState={() => <DataTableEmptyState columnCount={columnCount} />}
    >
      {(item) => {
        const row = item as Row<TData>;

        return (
          <DunetaTable.Row id={row.id}>
            {row.getVisibleCells().map((cell) => {
              const pin = pinEnabled
                ? getColumnPinPresentation(cell.column, table, 'body')
                : { className: '', style: {} };

              return (
                <DunetaTable.Cell
                  key={cell.id}
                  className={cn(
                    isSelectionColumnId(cell.column.id) && SELECTION_COLUMN_CLASS,
                    pin.className,
                  )}
                  style={pin.style}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </DunetaTable.Cell>
              );
            })}
          </DunetaTable.Row>
        );
      }}
    </DunetaTable.Body>
  );
}
