'use client';

import { memo, useState } from 'react';
import { TenoraDataTableGrid } from './TenoraDataTableGrid';
import { useTenoraDataTableContext } from './TenoraDataTableContext';
import type {
  TenoraDataTableEditConfig,
  TenoraDataTableEditingCell,
  TenoraDataTableColumnsUiConfig,
  TenoraDataTableVirtualConfig,
} from './types';

export type TenoraDataTableGridRegionProps<TData> = {
  ariaLabel: string;
  contentMaxHeight?: string;
  virtual?: TenoraDataTableVirtualConfig;
  virtualRows?: boolean;
  virtualColumns?: boolean;
  columnsUi?: TenoraDataTableColumnsUiConfig;
  columnsUiEnabled?: boolean;
  edit?: TenoraDataTableEditConfig<TData>;
  editEnabled?: boolean;
};

function TenoraDataTableGridRegionInner<TData>({
  ariaLabel,
  contentMaxHeight,
  virtual,
  virtualRows = true,
  virtualColumns = true,
  columnsUi,
  columnsUiEnabled = false,
  edit,
  editEnabled = false,
}: TenoraDataTableGridRegionProps<TData>) {
  const { table, onSortChange } = useTenoraDataTableContext<TData>();
  const [internalEditingCell, setInternalEditingCell] = useState<TenoraDataTableEditingCell>(null);

  const editingCell = editEnabled
    ? edit?.cell !== undefined
      ? edit.cell
      : internalEditingCell
    : null;
  const setEditingCell = editEnabled ? (edit?.onCellChange ?? setInternalEditingCell) : undefined;

  return (
    <TenoraDataTableGrid
      table={table}
      ariaLabel={ariaLabel}
      onSortChange={onSortChange}
      contentMaxHeight={contentMaxHeight}
      virtualRows={virtualRows}
      virtualColumns={virtualColumns}
      estimatedRowHeight={virtual?.estimatedRowHeight}
      rowOverscan={virtual?.rowOverscan}
      estimatedColumnWidth={virtual?.estimatedColumnWidth}
      columnOverscan={virtual?.columnOverscan}
      enableResize={columnsUiEnabled && columnsUi?.resize !== false}
      enableDrag={columnsUiEnabled && Boolean(columnsUi?.drag)}
      columnSizingDefaults={
        columnsUiEnabled
          ? {
              minWidth: columnsUi?.minWidth,
              maxWidth: columnsUi?.maxWidth,
              defaultWidth: columnsUi?.defaultWidth,
            }
          : undefined
      }
      editingCell={editingCell}
      onEditingCellChange={setEditingCell}
      onCellEdit={editEnabled ? edit?.onCellEdit : undefined}
    />
  );
}

export const TenoraDataTableGridRegion = memo(
  TenoraDataTableGridRegionInner,
) as typeof TenoraDataTableGridRegionInner;
