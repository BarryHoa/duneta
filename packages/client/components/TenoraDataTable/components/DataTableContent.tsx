'use client';

import type { Selection, SortDescriptor } from '@heroui/react';
import type { ReactNode } from 'react';
import { cn } from '../../../helpers';
import { TenoraTable } from '../../TenoraTable';

type DataTableContentProps = {
  ariaLabel: string;
  resizeEnabled: boolean;
  pinEnabled: boolean;
  tableMinWidth?: number;
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: (descriptor: SortDescriptor) => void;
  rowSelectionEnabled?: boolean;
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  children: ReactNode;
};

export function DataTableContent({
  ariaLabel,
  resizeEnabled,
  pinEnabled,
  tableMinWidth,
  sortDescriptor,
  onSortChange,
  rowSelectionEnabled = false,
  selectedKeys,
  onSelectionChange,
  children,
}: DataTableContentProps) {
  return (
    <TenoraTable.Content
      aria-label={ariaLabel}
      className={cn(
        'min-w-full !overflow-visible',
        resizeEnabled && '[table-layout:fixed]',
      )}
      style={pinEnabled && tableMinWidth ? { minWidth: tableMinWidth } : undefined}
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
      selectionMode={rowSelectionEnabled ? 'multiple' : undefined}
      selectedKeys={rowSelectionEnabled ? selectedKeys : undefined}
      onSelectionChange={rowSelectionEnabled ? onSelectionChange : undefined}
    >
      {children}
    </TenoraTable.Content>
  );
}
