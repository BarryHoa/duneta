'use client';

import type { SortDescriptor } from '@heroui/react';
import type { ReactNode } from 'react';
import { TenoraTable } from '../../TenoraTable';

type DataTableContentProps = {
  ariaLabel: string;
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: (descriptor: SortDescriptor) => void;
  children: ReactNode;
};

export function DataTableContent({
  ariaLabel,
  sortDescriptor,
  onSortChange,
  children,
}: DataTableContentProps) {
  return (
    <TenoraTable.Content
      aria-label={ariaLabel}
      className="min-w-full"
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
    >
      {children}
    </TenoraTable.Content>
  );
}
