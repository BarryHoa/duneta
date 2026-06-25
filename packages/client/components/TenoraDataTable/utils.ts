import type { SortDescriptor } from '@heroui/react';
import type { SortingState } from '@tanstack/react-table';

export function sortingStateToDescriptor(sorting: SortingState): SortDescriptor | undefined {
  const first = sorting[0];
  if (!first) return undefined;
  return { column: first.id, direction: first.desc ? 'descending' : 'ascending' };
}

export function descriptorToSortingState(descriptor?: SortDescriptor): SortingState {
  if (!descriptor?.column) return [];
  return [{ id: String(descriptor.column), desc: descriptor.direction === 'descending' }];
}

export function resolveRangeLine(
  pagination: { total: number; offset: number; rangeLine?: string | null } | undefined,
  pageItemCount: number,
): string | null {
  if (!pagination) return null;
  if (pagination.rangeLine === null) return null;
  if (typeof pagination.rangeLine === 'string') return pagination.rangeLine;
  if (pagination.total > 0 && pageItemCount > 0) {
    return `${pagination.offset + 1}–${pagination.offset + pageItemCount} / ${pagination.total}`;
  }
  return null;
}
