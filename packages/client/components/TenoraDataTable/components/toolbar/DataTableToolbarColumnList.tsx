'use client';

import { Checkbox } from '@heroui/react';
import { cn } from '../../../../helpers';
import { TenoraCheckbox } from '../../../TenoraCheckbox';
import { TenoraLabel } from '../../../TenoraLabel';
import { TenoraTypography } from '../../../TenoraTypography';
import { filterToolbarOptions } from './filter-options';
import type { ToolbarColumnOption } from './types';

const COLUMN_CHECKBOX_CONTROL_CLASS = cn(
  'border-accent bg-white shadow-sm',
  'dark:bg-zinc-900',
  'data-[selected=true]:border-transparent data-[selected=true]:bg-transparent',
);

type DataTableToolbarColumnListProps = {
  columns: ToolbarColumnOption[];
  draftVisibleIds: Set<string>;
  onToggle: (columnId: string, visible: boolean) => void;
  searchQuery: string;
};

export function DataTableToolbarColumnList({
  columns,
  draftVisibleIds,
  onToggle,
  searchQuery,
}: DataTableToolbarColumnListProps) {
  const filteredColumns = filterToolbarOptions(columns, searchQuery);

  if (filteredColumns.length === 0) {
    return (
      <TenoraTypography.Paragraph className="px-1 py-2 text-sm text-muted">
        No columns match your search.
      </TenoraTypography.Paragraph>
    );
  }

  return (
    <ul
      className={cn(
        'flex max-h-52 flex-col gap-0.5 overflow-y-auto',
        'rounded-md border border-border/60 bg-surface p-1',
      )}
    >
      {filteredColumns.map((column) => (
        <li key={column.id}>
          <TenoraCheckbox
            aria-label={`Toggle ${column.label} column`}
            className={cn(
              'w-full rounded-md px-2 py-1.5',
              'hover:bg-surface-secondary data-[hovered]:bg-surface-secondary',
            )}
            isSelected={draftVisibleIds.has(column.id)}
            onChange={(isSelected) => onToggle(column.id, isSelected)}
          >
            <Checkbox.Content className="flex w-full items-center gap-2">
              <Checkbox.Control className={COLUMN_CHECKBOX_CONTROL_CLASS}>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <TenoraLabel className="min-w-0 flex-1 truncate text-sm">
                {column.label}
              </TenoraLabel>
            </Checkbox.Content>
          </TenoraCheckbox>
        </li>
      ))}
    </ul>
  );
}
