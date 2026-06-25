'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  loadTenoraDataTableFavoriteFilters,
  saveTenoraDataTableFavoriteFilters,
} from './favorite-filters-storage';
import type { TenoraDataTableFavoriteFilter } from './types';

export function useTenoraDataTableFavoriteFilters(
  storageKey: string,
  initial: TenoraDataTableFavoriteFilter[] = [],
) {
  const [favorites, setFavoritesState] = useState<TenoraDataTableFavoriteFilter[]>(() => {
    if (!storageKey) return initial;
    return loadTenoraDataTableFavoriteFilters(storageKey) ?? initial;
  });

  useEffect(() => {
    if (!storageKey) return;
    const stored = loadTenoraDataTableFavoriteFilters(storageKey);
    if (stored) setFavoritesState(stored);
  }, [storageKey]);

  const setFavorites = useCallback(
    (next: TenoraDataTableFavoriteFilter[] | ((prev: TenoraDataTableFavoriteFilter[]) => TenoraDataTableFavoriteFilter[])) => {
      setFavoritesState((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        if (storageKey) saveTenoraDataTableFavoriteFilters(storageKey, resolved);
        return resolved;
      });
    },
    [storageKey],
  );

  return [favorites, setFavorites] as const;
}
