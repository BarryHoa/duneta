import type { Header } from '@tanstack/react-table';

export function getHeaderLabel<TData>(header: Header<TData, unknown>): string {
  const def = header.column.columnDef.header;
  if (typeof def === 'string') return def;
  return header.column.id;
}
