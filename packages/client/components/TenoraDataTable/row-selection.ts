import type { RowSelectionState } from '@tanstack/react-table';
import type { TenoraDataTableRowSelectionConfig } from './types';

export function selectedIdsToRowSelection(selectedIds: string[]): RowSelectionState {
  return Object.fromEntries(selectedIds.map((id) => [id, true]));
}

export function rowSelectionToSelectedIds(selection: RowSelectionState): string[] {
  return Object.entries(selection)
    .filter(([, selected]) => selected)
    .map(([id]) => id);
}

export function normalizeRowSelectionChange(
  config: TenoraDataTableRowSelectionConfig,
  next: RowSelectionState,
): string[] {
  const ids = rowSelectionToSelectedIds(next);
  if (config.type === 'radio') {
    return ids.length ? [ids[ids.length - 1]] : [];
  }
  return ids;
}
