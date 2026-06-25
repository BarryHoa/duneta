'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { TenoraCheckbox } from '../TenoraCheckbox';
import {
  TENORA_DATA_TABLE_SELECTION_COLUMN_ID,
  type TenoraDataTableColumnMeta,
  type TenoraDataTableRowSelectionConfig,
} from './types';

export function createTenoraDataTableSelectionColumn<TData>(
  config: Pick<TenoraDataTableRowSelectionConfig, 'type' | 'groupSelection'> & {
    instanceId?: string;
  },
): ColumnDef<TData, unknown> {
  const isRadio = config.type === 'radio';
  const radioName = `tenora-data-table-row-selection-${config.instanceId ?? 'unknown'}`;

  return {
    id: TENORA_DATA_TABLE_SELECTION_COLUMN_ID,
    size: 44,
    minSize: 44,
    maxSize: 44,
    enableSorting: false,
    enableHiding: false,
    enableGrouping: false,
    enableResizing: false,
    header: ({ table }) =>
      isRadio ? null : (
        <TenoraCheckbox
          aria-label="Select all rows"
          isSelected={table.getIsAllPageRowsSelected()}
          isIndeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
    cell: ({ row }) => {
      if (isRadio) {
        return (
          <input
            type="radio"
            name={radioName}
            aria-label="Select row"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="size-4 accent-[color:var(--accent)]"
          />
        );
      }

      if (config.groupSelection && row.getCanExpand()) {
        return (
          <TenoraCheckbox
            aria-label="Select group"
            isSelected={row.getIsAllSubRowsSelected()}
            isIndeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        );
      }

      return (
        <TenoraCheckbox
          aria-label="Select row"
          isSelected={row.getIsSelected()}
          isDisabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      );
    },
    meta: {
      freeze: 'left',
      thClassName: 'w-11 px-2',
      tdClassName: 'w-11 px-2',
      width: 44,
      minWidth: 44,
      maxWidth: 44,
    } satisfies TenoraDataTableColumnMeta,
  };
}
