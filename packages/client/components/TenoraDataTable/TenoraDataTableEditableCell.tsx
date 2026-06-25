'use client';

import { flexRender, type Cell } from '@tanstack/react-table';
import { memo, useCallback, useEffect, useState } from 'react';
import { TenoraDatePicker } from '../TenoraInput/TenoraDatePicker';
import { TenoraInput } from '../TenoraInput';
import { TenoraInputNumber, type TenoraInputNumberValue } from '../TenoraInput/TenoraInputNumber';
import { TenoraSelectSingle } from '../TenoraSelect/TenoraSelectSingle';
import type { TenoraDataTableColumnMeta, TenoraDataTableEditingCell } from './types';

function parseCommitValue(
  editType: TenoraDataTableColumnMeta['editType'],
  draft: string,
  numberDraft: TenoraInputNumberValue,
  selectDraft: string,
) {
  if (editType === 'number') return numberDraft;
  if (editType === 'select') return selectDraft;
  return draft;
}

function TenoraDataTableEditableCellInner<TData>({
  cell,
  editingCell,
  onEditingCellChange,
  onCellEdit,
}: {
  cell: Cell<TData, unknown>;
  editingCell: TenoraDataTableEditingCell;
  onEditingCellChange?: (cell: TenoraDataTableEditingCell) => void;
  onCellEdit?: (edit: {
    rowId: string;
    columnId: string;
    row: TData;
    value: unknown;
  }) => void | Promise<void>;
}) {
  const meta = cell.column.columnDef.meta as TenoraDataTableColumnMeta | undefined;
  const editType = meta?.editType ?? 'text';
  const row = cell.row.original;
  const rowId = cell.row.id;
  const columnId = cell.column.id;
  const isEditing = editingCell?.rowId === rowId && editingCell.columnId === columnId;
  const rawValue = cell.getValue();

  const [textDraft, setTextDraft] = useState(() => String(rawValue ?? ''));
  const [numberDraft, setNumberDraft] = useState<TenoraInputNumberValue>(() =>
    typeof rawValue === 'number' ? rawValue : rawValue == null ? null : Number(rawValue),
  );
  const [selectDraft, setSelectDraft] = useState(() => String(rawValue ?? ''));

  useEffect(() => {
    if (!isEditing) return;
    setTextDraft(String(rawValue ?? ''));
    setNumberDraft(
      typeof rawValue === 'number' ? rawValue : rawValue == null ? null : Number(rawValue),
    );
    setSelectDraft(String(rawValue ?? ''));
  }, [isEditing, rawValue]);

  const commit = useCallback(async () => {
    onEditingCellChange?.(null);
    const value = parseCommitValue(editType, textDraft, numberDraft, selectDraft);
    await onCellEdit?.({ rowId, columnId, row, value });
  }, [
    columnId,
    editType,
    numberDraft,
    onCellEdit,
    onEditingCellChange,
    row,
    rowId,
    selectDraft,
    textDraft,
  ]);

  const cancel = useCallback(() => {
    onEditingCellChange?.(null);
  }, [onEditingCellChange]);

  if (!meta?.editable || !onCellEdit) {
    return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>;
  }

  if (isEditing) {
    if (editType === 'number') {
      return (
        <TenoraInputNumber
          aria-label={`Edit ${columnId}`}
          className="min-w-0 w-full"
          value={numberDraft}
          onValueChange={setNumberDraft}
          onBlur={() => void commit()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void commit();
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              cancel();
            }
          }}
        />
      );
    }

    if (editType === 'date') {
      return (
        <TenoraDatePicker
          aria-label={`Edit ${columnId}`}
          className="min-w-0 w-full"
          value={textDraft || null}
          onChange={(event) => setTextDraft(event.target.value)}
          onBlur={() => void commit()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void commit();
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              cancel();
            }
          }}
        />
      );
    }

    if (editType === 'select' && meta.editOptions?.length) {
      return (
        <TenoraSelectSingle
          ariaLabel={`Edit ${columnId}`}
          className="min-w-0 w-full"
          options={meta.editOptions.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          value={selectDraft}
          onChange={(value) => {
            setSelectDraft(value);
            onEditingCellChange?.(null);
            void onCellEdit?.({ rowId, columnId, row, value });
          }}
          search={false}
          allowClear={false}
          fullWidth
        />
      );
    }

    return (
      <TenoraInput
        aria-label={`Edit ${columnId}`}
        className="min-w-0 w-full"
        value={textDraft}
        onChange={(event) => setTextDraft(event.target.value)}
        onBlur={() => void commit()}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            void commit();
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            cancel();
          }
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className="block w-full min-w-0 cursor-text rounded px-1 py-0.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
      onClick={() => onEditingCellChange?.({ rowId, columnId })}
      onDoubleClick={() => onEditingCellChange?.({ rowId, columnId })}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </button>
  );
}

function editableCellPropsEqual<TData>(
  previous: {
    cell: Cell<TData, unknown>;
    editingCell: TenoraDataTableEditingCell;
    onEditingCellChange?: (cell: TenoraDataTableEditingCell) => void;
    onCellEdit?: (edit: {
      rowId: string;
      columnId: string;
      row: TData;
      value: unknown;
    }) => void | Promise<void>;
  },
  next: {
    cell: Cell<TData, unknown>;
    editingCell: TenoraDataTableEditingCell;
    onEditingCellChange?: (cell: TenoraDataTableEditingCell) => void;
    onCellEdit?: (edit: {
      rowId: string;
      columnId: string;
      row: TData;
      value: unknown;
    }) => void | Promise<void>;
  },
) {
  if (previous.cell.id !== next.cell.id) return false;
  if (
    previous.onEditingCellChange !== next.onEditingCellChange ||
    previous.onCellEdit !== next.onCellEdit
  ) {
    return false;
  }

  const wasEditing =
    previous.editingCell?.rowId === previous.cell.row.id &&
    previous.editingCell?.columnId === previous.cell.column.id;
  const isEditing =
    next.editingCell?.rowId === next.cell.row.id &&
    next.editingCell?.columnId === next.cell.column.id;

  if (wasEditing || isEditing) return false;
  return true;
}

export const TenoraDataTableEditableCell = memo(
  TenoraDataTableEditableCellInner,
  editableCellPropsEqual,
) as typeof TenoraDataTableEditableCellInner;
