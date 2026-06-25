'use client';

import { Pagination } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TenoraTable } from '../../../TenoraTable';
import type { TenoraDataTablePaginationConfig } from '../../types';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30];

type DataTableFooterProps = {
  pagination: TenoraDataTablePaginationConfig;
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
      <Pagination size="sm">
        <Pagination.Summary>
          {start} to {end} of {total} results
        </Pagination.Summary>
        {onPageSizeChange ? (
          <label className="flex items-center gap-2 text-sm text-muted">
            <span>Rows</span>
            <select
              className="rounded-md border border-border bg-surface px-2 py-1 text-sm"
              value={pageSize}
              onChange={(event) =>
                onPageSizeChange(Number(event.target.value))
              }
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={page <= 1}
              onPress={() => onPageChange?.(Math.max(1, page - 1))}
            >
              <ChevronLeft aria-hidden className="size-4" strokeWidth={2} />
              Prev
            </Pagination.Previous>
          </Pagination.Item>
          {pages.map((pageNumber) => (
            <Pagination.Item key={pageNumber}>
              <Pagination.Link
                isActive={pageNumber === page}
                onPress={() => onPageChange?.(pageNumber)}
              >
                {pageNumber}
              </Pagination.Link>
            </Pagination.Item>
          ))}
          <Pagination.Item>
            <Pagination.Next
              isDisabled={page >= pageCount}
              onPress={() => onPageChange?.(Math.min(pageCount, page + 1))}
            >
              Next
              <ChevronRight aria-hidden className="size-4" strokeWidth={2} />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </TenoraTable.Footer>
  );
}
