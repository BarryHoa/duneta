'use client';

import type { SortDescriptor } from '@heroui/react';
import { useCallback, useMemo, useState } from 'react';
import {
  TenoraDataTable,
  TenoraLink as Link,
  type ColumnDef,
  type TenoraDataTableDataType,
} from '@tenora/client/components';
import {
  createDemoProductRows,
  type DemoProductRow,
} from '~/lib/datatable-demo-data';

const ROW_COUNT = 50;
const PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [20];

// en-US grouping is stable across Node SSR and browsers (vi-VN ICU can differ).
const vndFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatVnd(amount: number): string {
  return `${vndFormatter.format(amount)} ₫`;
}

const columns: Array<ColumnDef<DemoProductRow, unknown>> = [
  {
    id: 'sku',
    accessorKey: 'sku',
    header: 'SKU',
    meta: { defaultWidth: 120, minWidth: 80 },
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Product',
    meta: { defaultWidth: 'auto', minWidth: 160, pin: 'left' },
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
    meta: { defaultWidth: 140 },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = String(getValue() ?? '');
      const tone =
        value === 'active'
          ? 'text-emerald-600 dark:text-emerald-300'
          : value === 'draft'
            ? 'text-amber-600 dark:text-amber-300'
            : 'text-slate-500';
      return <span className={`capitalize ${tone}`}>{value}</span>;
    },
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Price',
    meta: { defaultWidth: 130, maxWidth: 200 },
    cell: ({ getValue }) => formatVnd(Number(getValue() ?? 0)),
  },
  { id: 'stock', accessorKey: 'stock', header: 'Stock' },
  {
    id: 'margin',
    accessorKey: 'margin',
    header: 'Margin %',
    cell: ({ getValue }) => `${getValue()}%`,
  },
  { id: 'supplier', accessorKey: 'supplier', header: 'Supplier' },
  { id: 'warehouse', accessorKey: 'warehouse', header: 'WH' },
  { id: 'updatedAt', accessorKey: 'updatedAt', header: 'Updated' },
  {
    id: 'notes',
    accessorKey: 'notes',
    header: 'Notes',
    meta: { defaultWidth: 220 },
  },
  {
    id: 'weight',
    accessorKey: 'weight',
    header: 'Weight (kg)',
    cell: ({ getValue }) => Number(getValue()).toFixed(2),
  },
  { id: 'origin', accessorKey: 'origin', header: 'Origin' },
  { id: 'batch', accessorKey: 'batch', header: 'Batch' },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <button
        type="button"
        className="text-sm text-cyan-600 hover:underline dark:text-cyan-300"
      >
        View
      </button>
    ),
    enableSorting: false,
    meta: { pin: 'right' },
  },
];

function compareRows(
  a: DemoProductRow,
  b: DemoProductRow,
  descriptor: SortDescriptor | undefined,
): number {
  if (!descriptor?.column) return 0;

  const key = String(descriptor.column) as keyof DemoProductRow;
  const left = a[key];
  const right = b[key];
  const direction = descriptor.direction === 'descending' ? -1 : 1;

  if (typeof left === 'number' && typeof right === 'number') {
    return (left - right) * direction;
  }

  return String(left ?? '').localeCompare(String(right ?? '')) * direction;
}

function fetchServerPage(
  rows: DemoProductRow[],
  page: number,
  pageSize: number,
  sort: SortDescriptor | undefined,
): DemoProductRow[] {
  const sorted = [...rows].sort((a, b) => compareRows(a, b, sort));
  const start = (page - 1) * pageSize;
  return sorted.slice(start, start + pageSize);
}

export function meta() {
  return [
    { title: 'DataTable demo — Tenora' },
    {
      name: 'description',
      content: 'TenoraDataTable test: static vs dynamic data modes.',
    },
  ];
}

export default function DataTableDemoPage() {
  const allRows = useMemo(() => createDemoProductRows(ROW_COUNT), []);
  const [dataType, setDataType] = useState<TenoraDataTableDataType>('dynamic');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<
    SortDescriptor | undefined
  >();

  const dynamicRows = useMemo(
    () => fetchServerPage(allRows, page, PAGE_SIZE, sortDescriptor),
    [allRows, page, sortDescriptor],
  );

  const tableData = dataType === 'static' ? allRows : dynamicRows;

  const handleDataTypeChange = useCallback(
    (next: TenoraDataTableDataType) => {
      setDataType(next);
      setPage(1);
      setSortDescriptor(undefined);
      setSelectedIds([]);
    },
    [],
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
            Playground
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">
            TenoraDataTable
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {ROW_COUNT} rows · {columns.length} columns · {PAGE_SIZE} rows/page ·
            drag · resize · pin · row selection · sort. Route:{' '}
            <code className="text-cyan-700 dark:text-cyan-200">/datatable</code>
          </p>
        </div>
        <Link
          href="/about"
          className="text-sm text-cyan-700 hover:underline dark:text-cyan-300"
        >
          ← About
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">dataType</span>
        {(['static', 'dynamic'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => handleDataTypeChange(mode)}
            className={
              dataType === mode
                ? 'rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white'
                : 'rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }
          >
            {mode}
          </button>
        ))}
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          {dataType === 'static'
            ? 'Full dataset in table — client sort & pagination'
            : 'Simulated server page — server sort & pagination'}
        </span>
      </div>

      <TenoraDataTable<DemoProductRow>
        ariaLabel="Product catalog test"
        columnDrag
        columnResize
        dataType={dataType}
        data={tableData}
        columns={columns}
        getRowId={(row) => row.id}
        rowSelection={{
          selectedIds,
          onChange: setSelectedIds,
        }}
        sort={
          dataType === 'dynamic'
            ? {
                descriptor: sortDescriptor,
                onChange: (descriptor) => {
                  setSortDescriptor(descriptor);
                  setPage(1);
                },
              }
            : undefined
        }
        pagination={{
          total: dataType === 'dynamic' ? allRows.length : undefined,
          page,
          pageSize: PAGE_SIZE,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onPageChange: setPage,
        }}
        height="300px"
      />

      {selectedIds.length > 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Selected {selectedIds.length} row{selectedIds.length === 1 ? '' : 's'}:{' '}
          <code className="text-cyan-700 dark:text-cyan-200">
            {selectedIds.join(', ')}
          </code>
        </p>
      ) : null}
    </main>
  );
}
