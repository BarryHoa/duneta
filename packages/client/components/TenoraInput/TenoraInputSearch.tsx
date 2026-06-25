'use client';

import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TenoraButton } from '../TenoraButton';
import { TenoraInput } from './TenoraInput';

// Search input with cancellable lodash debounce.

export type TenoraInputSearchProps = {
  initialValue?: string;
  onDebouncedChange: (value: string) => void;
  onRefresh?: () => void;
  debounceMs?: number;
  isRefreshing?: boolean;
  placeholder?: string;
  ariaLabel: string;
  refreshAria?: string;
  clearAria?: string;
  className?: string;
};

export function TenoraInputSearch({
  initialValue = '',
  onDebouncedChange,
  onRefresh,
  debounceMs = 300,
  isRefreshing = false,
  placeholder,
  ariaLabel,
  refreshAria = 'Refresh search',
  clearAria = 'Clear search',
  className = '',
}: TenoraInputSearchProps) {
  const [search, setSearch] = useState(initialValue);
  const debouncedChange = useMemo(
    () => debounce((next: string) => onDebouncedChange(next), debounceMs),
    [debounceMs, onDebouncedChange],
  );

  useEffect(() => {
    setSearch(initialValue);
  }, [initialValue]);

  useEffect(() => {
    debouncedChange(search);
    return () => debouncedChange.cancel();
  }, [debouncedChange, search]);

  const refresh = useCallback(() => {
    debouncedChange.cancel();
    onDebouncedChange(search);
    onRefresh?.();
  }, [debouncedChange, onDebouncedChange, onRefresh, search]);

  const hasValue = search.trim().length > 0;
  return (
    <div className={`relative min-w-0 flex-1 sm:max-w-md ${className}`}>
      <TenoraInput aria-label={ariaLabel} className={`w-full ${hasValue ? 'pr-[4.25rem]' : 'pr-11'}`} placeholder={placeholder} value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="absolute inset-y-0 right-1 z-10 flex items-center gap-0.5">
        {hasValue ? <TenoraButton type="button" isIconOnly size="sm" variant="ghost" aria-label={clearAria} onPress={() => setSearch('')}>×</TenoraButton> : null}
        {onRefresh ? <TenoraButton type="button" isIconOnly size="sm" variant="ghost" isDisabled={isRefreshing} aria-label={refreshAria} onPress={refresh}>{isRefreshing ? '◌' : '↻'}</TenoraButton> : null}
      </div>
    </div>
  );
}
