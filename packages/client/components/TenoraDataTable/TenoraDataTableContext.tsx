'use client';

import type { SortDescriptor } from '@heroui/react';
import type { Table } from '@tanstack/react-table';
import { createContext, useContext } from 'react';

export type TenoraDataTableContextValue<TData> = {
  table: Table<TData>;
  onSortChange: (sort: SortDescriptor) => void;
};

const TenoraDataTableContext = createContext<TenoraDataTableContextValue<unknown> | null>(null);

export function TenoraDataTableProvider<TData>({
  value,
  children,
}: {
  value: TenoraDataTableContextValue<TData>;
  children: React.ReactNode;
}) {
  return (
    <TenoraDataTableContext.Provider value={value as TenoraDataTableContextValue<unknown>}>
      {children}
    </TenoraDataTableContext.Provider>
  );
}

export function useTenoraDataTableContext<TData>() {
  const context = useContext(TenoraDataTableContext);
  if (!context) {
    throw new Error('useTenoraDataTableContext must be used within TenoraDataTableProvider');
  }
  return context as TenoraDataTableContextValue<TData>;
}
