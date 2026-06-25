'use client';

import type { Column } from '@tanstack/react-table';
import { memo, useEffect, useState } from 'react';
import { TenoraInput } from '../TenoraInput';

function TenoraDataTableColumnFilterInputInner<TData>({
  column,
  debounceMs = 300,
}: {
  column: Column<TData, unknown>;
  debounceMs?: number;
}) {
  const [value, setValue] = useState(() => String(column.getFilterValue() ?? ''));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      column.setFilterValue(value || undefined);
    }, debounceMs);
    return () => window.clearTimeout(timer);
  }, [column, debounceMs, value]);

  return (
    <TenoraInput
      aria-label={`Filter ${column.id}`}
      className="w-36 shrink-0"
      placeholder={String(column.columnDef.header ?? column.id)}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

export const TenoraDataTableColumnFilterInput = memo(
  TenoraDataTableColumnFilterInputInner,
) as typeof TenoraDataTableColumnFilterInputInner;
