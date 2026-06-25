'use client';

import { useState } from 'react';
import { TenoraSearchField } from '../../../TenoraSearchField';

type DataTableToolbarPanelSearchProps = {
  ariaLabel: string;
  placeholder: string;
  onQueryChange: (query: string) => void;
};

export function DataTableToolbarPanelSearch({
  ariaLabel,
  placeholder,
  onQueryChange,
}: DataTableToolbarPanelSearchProps) {
  const [query, setQuery] = useState('');

  return (
    <TenoraSearchField
      aria-label={ariaLabel}
      className="w-full"
      value={query}
      onChange={(next) => {
        setQuery(next);
        onQueryChange(next);
      }}
    >
      <TenoraSearchField.Group className="w-full">
        <TenoraSearchField.SearchIcon />
        <TenoraSearchField.Input placeholder={placeholder} />
        <TenoraSearchField.ClearButton />
      </TenoraSearchField.Group>
    </TenoraSearchField>
  );
}
