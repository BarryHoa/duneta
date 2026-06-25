import type { TenoraDataTableFavoriteFilter } from './types';

const STORAGE_PREFIX = 'tenora:data-table:favorites:';

export function loadTenoraDataTableFavoriteFilters(
  storageKey: string,
): TenoraDataTableFavoriteFilter[] | null {
  if (typeof window === 'undefined' || !storageKey) return null;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${storageKey}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TenoraDataTableFavoriteFilter[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveTenoraDataTableFavoriteFilters(
  storageKey: string,
  favorites: TenoraDataTableFavoriteFilter[],
) {
  if (typeof window === 'undefined' || !storageKey) return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${storageKey}`, JSON.stringify(favorites));
  } catch {
    // ignore quota / private mode
  }
}
