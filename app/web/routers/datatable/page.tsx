'use client';

import { useMemo, useState } from 'react';
import {
  TenoraDataTable,
  TenoraLink as Link,
  type ColumnDef,
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
    meta: { defaultWidth: 'auto', minWidth: 160 },
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
  },
];

export function meta() {
  return [
    { title: 'DataTable demo — Tenora' },
    {
      name: 'description',
      content: 'TenoraDataTable test: 50 rows, 15 columns, 20 rows per page.',
    },
  ];
}

export default function DataTableDemoPage() {
  const rows = useMemo(() => createDemoProductRows(ROW_COUNT), []);
  const [page, setPage] = useState(1);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [page, rows]);

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
            Test: {ROW_COUNT} rows · {columns.length} columns · {PAGE_SIZE}{' '}
            rows/page (3 pages) · drag columns · resize columns · sort. Route:{' '}
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

      <TenoraDataTable<DemoProductRow>
        ariaLabel="Product catalog test"
        columnDrag
        columnResize
        data={pagedRows}
        columns={columns}
        getRowId={(row) => row.id}
        pagination={{
          total: rows.length,
          page,
          pageSize: PAGE_SIZE,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onPageChange: setPage,
        }}
        height="300px"
      />
    </main>
  );
}
