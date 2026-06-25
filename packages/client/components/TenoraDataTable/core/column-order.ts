import type { ColumnDef, ColumnOrderState } from '@tanstack/react-table';

export function resolveColumnId<TData>(
  column: ColumnDef<TData, unknown>,
  index: number,
): string {
  if (column.id) return column.id;
  const accessorKey = (column as { accessorKey?: string | number }).accessorKey;
  if (accessorKey != null) return String(accessorKey);
  return `column-${index}`;
}

export function createInitialColumnOrder<TData>(
  columns: Array<ColumnDef<TData, unknown>>,
): ColumnOrderState {
  return columns.map((column, index) => resolveColumnId(column, index));
}
