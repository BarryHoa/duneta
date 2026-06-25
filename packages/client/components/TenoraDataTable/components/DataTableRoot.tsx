'use client';

import type { ReactNode } from 'react';
import { TenoraTable } from '../../TenoraTable';

type DataTableRootProps = {
  className?: string;
  virtualEnabled: boolean;
  height: number | string;
  resizeEnabled: boolean;
  children: ReactNode;
  footer?: ReactNode;
};

export function DataTableRoot({
  className,
  virtualEnabled,
  height,
  resizeEnabled,
  children,
  footer,
}: DataTableRootProps) {
  const tableContent = (
    <TenoraTable.ScrollContainer
      className={virtualEnabled ? 'overflow-auto' : undefined}
      style={virtualEnabled ? { height, maxHeight: height } : undefined}
    >
      {resizeEnabled ? (
        <TenoraTable.ResizableContainer className="min-w-full">
          {children}
        </TenoraTable.ResizableContainer>
      ) : (
        children
      )}
    </TenoraTable.ScrollContainer>
  );

  return (
    <TenoraTable className={className}>
      {tableContent}
      {footer}
    </TenoraTable>
  );
}
