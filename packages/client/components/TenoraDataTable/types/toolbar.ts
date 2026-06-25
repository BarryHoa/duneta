import type { ReactNode } from 'react';

export type TenoraDataTableToolbarSearchConfig = {
  placeholder?: string;
  initialValue?: string;
  debounceMs?: number;
  /** Fired after debounce. Omit for client-side global filter in `dataType="static"`. */
  onChange?: (query: string) => void;
};

export type TenoraDataTableToolbarFilterConfig = {
  /** Badge count on the filter button. */
  activeCount?: number;
  /** Custom filter panel content (manage draft state internally). */
  children?: ReactNode;
  /** Commits filter draft when user presses Apply. */
  onApply?: () => void;
};

export type TenoraDataTableToolbarGroupConfig = {
  /**
   * Column ids eligible for grouping (whitelist).
   * Overrides `meta.groupable` on column defs.
   */
  columnIds?: string[];
  /** Controlled group column id. `null` clears grouping. */
  value?: string | null;
  onChange?: (columnId: string | null) => void;
};

export type TenoraDataTableToolbarColumnConfig = {
  /** Column ids that cannot be hidden. */
  lockedColumnIds?: string[];
  /** Column ids hidden when visibility is reset. Merged with `meta.defaultHidden`. */
  hiddenByDefault?: string[];
};

export type DataTableColumnResetHandlers = {
  resetAll: () => void;
  resetWidths: () => void;
  resetOrder: () => void;
  resetVisibility: () => void;
  getDefaultVisibleColumnIds: () => string[];
};

export type TenoraDataTableToolbarFeatureConfig<T> = boolean | T;

export type TenoraDataTableToolbarConfig = {
  search?: TenoraDataTableToolbarFeatureConfig<TenoraDataTableToolbarSearchConfig>;
  filter?: TenoraDataTableToolbarFeatureConfig<TenoraDataTableToolbarFilterConfig>;
  group?: TenoraDataTableToolbarFeatureConfig<TenoraDataTableToolbarGroupConfig>;
  column?: TenoraDataTableToolbarFeatureConfig<TenoraDataTableToolbarColumnConfig>;
};

export type ResolvedTenoraDataTableToolbarConfig = {
  search: TenoraDataTableToolbarSearchConfig | null;
  filter: TenoraDataTableToolbarFilterConfig | null;
  group: TenoraDataTableToolbarGroupConfig | null;
  column: TenoraDataTableToolbarColumnConfig | null;
};
