import type { ReactNode } from 'react';

export type IbaseSelectSingleOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  /** Required for reliable filtering when `label` is not plain text. */
  searchText?: string;
  isDisabled?: boolean;
};

export type IbaseSelectSingleSearchPattern = 'contains' | 'startsWith' | 'exact';

export type IbaseSelectSingleSearchRule = {
  key: 'label' | 'value' | (string & {});
  pattern?: IbaseSelectSingleSearchPattern | RegExp;
};

export type IbaseSelectSingleVirtualConfig = {
  estimatedItemSize?: number;
  maxHeight?: number;
  overscan?: number;
};

export type IbaseSelectSingleSearch = false | {
  rules?: readonly IbaseSelectSingleSearchRule[];
  placeholder?: string;
  debounceMs?: number;
};

export type IbaseSelectSingleProps<T extends string = string> = {
  ariaLabel?: string;
  'aria-label'?: string;
  options: readonly IbaseSelectSingleOption<T>[];
  value?: T | '' | null;
  onChange: (value: T | '') => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  allowClear?: boolean;
  /** `false` removes the search field; object configuration uses uFuzzy by default. */
  search?: IbaseSelectSingleSearch;
  /** Virtualize large result sets. `true` uses sensible defaults. */
  virtual?: boolean | IbaseSelectSingleVirtualConfig;
};
