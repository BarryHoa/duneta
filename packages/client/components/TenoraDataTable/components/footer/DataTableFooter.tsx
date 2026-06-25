'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TenoraLabel } from '../../../TenoraLabel';
import { TenoraPagination } from '../../../TenoraPagination';
import { TenoraTable } from '../../../TenoraTable';
import type { TenoraDataTablePaginationConfig } from '../../types';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30];

type DataTableFooterProps = {
  pagination: TenoraDataTablePaginationConfig & { total: number };
};

export function DataTableFooter({ pagination }: DataTableFooterProps) {
  const {
    total,
    pageSize,
    page,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    onPageChange,
    onPageSizeChange,
  } = pagination;

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <TenoraTable.Footer>
      <TenoraPagination size="sm">
        <TenoraPagination.Summary>
          {start} to {end} of {total} results
        </TenoraPagination.Summary>
        {onPageSizeChange ? (
          <TenoraLabel className="flex items-center gap-2 text-sm text-muted">
            <span>Rows</span>
            <select
              className="rounded-md border border-border bg-surface px-2 py-1 text-sm"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </TenoraLabel>
        ) : null}
        <TenoraPagination.Content>
          <TenoraPagination.Item>
            <TenoraPagination.Previous
              isDisabled={page <= 1}
              onPress={() => onPageChange?.(Math.max(1, page - 1))}
            >
              <ChevronLeft aria-hidden className="size-4" strokeWidth={2} />
            </TenoraPagination.Previous>
          </TenoraPagination.Item>
          {pages.map((pageNumber) => (
            <TenoraPagination.Item key={pageNumber}>
              <TenoraPagination.Link
                isActive={pageNumber === page}
                onPress={() => onPageChange?.(pageNumber)}
              >
                {pageNumber}
              </TenoraPagination.Link>
            </TenoraPagination.Item>
          ))}
          <TenoraPagination.Item>
            <TenoraPagination.Next
              isDisabled={page >= pageCount}
              onPress={() => onPageChange?.(Math.min(pageCount, page + 1))}
            >
              <ChevronRight aria-hidden className="size-4" strokeWidth={2} />
            </TenoraPagination.Next>
          </TenoraPagination.Item>
        </TenoraPagination.Content>
      </TenoraPagination>
    </TenoraTable.Footer>
  );
}
