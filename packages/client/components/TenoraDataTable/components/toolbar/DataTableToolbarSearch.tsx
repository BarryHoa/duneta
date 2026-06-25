'use client';

import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import { TenoraSearchField } from '../../../TenoraSearchField';
import type { TenoraDataTableToolbarSearchConfig } from '../../types/toolbar';

type DataTableToolbarSearchProps = {
  config: TenoraDataTableToolbarSearchConfig;
  onDebouncedChange: (query: string) => void;
};

export function DataTableToolbarSearch({
  config,
  onDebouncedChange,
}: DataTableToolbarSearchProps) {
  const { placeholder = 'Search…', initialValue = '', debounceMs = 300 } =
    config;
  const [value, setValue] = useState(initialValue);

  const debouncedChange = useMemo(
    () => debounce((next: string) => onDebouncedChange(next), debounceMs),
    [debounceMs, onDebouncedChange],
  );

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    debouncedChange(value);
    return () => debouncedChange.cancel();
  }, [debouncedChange, value]);

  return (
    <TenoraSearchField
      aria-label="Search table"
      className="min-w-0 flex-1"
      value={value}
      onChange={setValue}
    >
      <TenoraSearchField.Group className="w-full min-w-[12rem] max-w-md">
        <TenoraSearchField.SearchIcon />
        <TenoraSearchField.Input placeholder={placeholder} />
        <TenoraSearchField.ClearButton />
      </TenoraSearchField.Group>
    </TenoraSearchField>
  );
}
