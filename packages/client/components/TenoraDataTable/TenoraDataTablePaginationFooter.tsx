'use client';

import { Pagination } from '@heroui/react';
import { cn } from '../../helpers';
import type { TenoraDataTablePaginationOffsetConfig } from './types';
import { resolveRangeLine } from './utils';

export function TenoraDataTablePaginationFooter({
  pagination,
  pageItemCount,
}: {
  pagination: TenoraDataTablePaginationOffsetConfig;
  pageItemCount: number;
}) {
  const {
    total,
    offset,
    limit,
    onPageChange,
    previousLabel = 'Previous',
    nextLabel = 'Next',
    isDisabled = false,
  } = pagination;

  const rangeLine = resolveRangeLine(pagination, pageItemCount);
  const resolvedLimit = limit ?? 20;
  const hasPreviousPage = offset > 0;
  const hasNextPage = limit != null ? offset + resolvedLimit < total : false;
  const showNav = limit != null && onPageChange != null && total > limit;

  if (!rangeLine && !showNav) return null;

  return (
    <footer className="flex w-full shrink-0 items-center gap-4 border-t border-zinc-200/80 bg-zinc-50/60 px-4 py-3 dark:border-zinc-700/80 dark:bg-zinc-900/40">
      {rangeLine ? (
        <p className={cn('min-w-0 text-sm leading-snug text-zinc-600 dark:text-zinc-400', showNav && 'flex-1')}>
          {rangeLine}
        </p>
      ) : showNav ? (
        <span className="min-w-0 flex-1" aria-hidden />
      ) : null}

      {showNav && onPageChange ? (
        <Pagination className="ml-auto w-auto shrink-0" size="sm" aria-label="Pagination">
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={isDisabled || !hasPreviousPage}
                onPress={() => onPageChange(Math.max(0, offset - resolvedLimit))}
              >
                <Pagination.PreviousIcon />
                <span>{previousLabel}</span>
              </Pagination.Previous>
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Next
                isDisabled={isDisabled || !hasNextPage}
                onPress={() => onPageChange(offset + resolvedLimit)}
              >
                <span>{nextLabel}</span>
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      ) : null}
    </footer>
  );
}
