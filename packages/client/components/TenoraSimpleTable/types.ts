import type { ReactNode } from 'react';

export type TenoraSimpleTableColumn<T> = {
  key: keyof T & string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  className?: string;
};

export type TenoraSimpleTableProps<T> = {
  data: readonly T[];
  columns: readonly TenoraSimpleTableColumn<T>[];
  getRowKey: (row: T, index: number) => string;
  emptyState?: ReactNode;
  className?: string;
};
