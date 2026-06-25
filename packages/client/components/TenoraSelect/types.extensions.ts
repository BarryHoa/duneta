import type { ReactNode } from 'react';

export type TenoraSelectSingleOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  /** Required for reliable filtering when `label` is not plain text. */
  searchText?: string;
  isDisabled?: boolean;
};

export type TenoraSelectSingleSearchPattern = 'contains' | 'startsWith' | 'exact';

export type TenoraSelectSingleSearchRule = {
  key: 'label' | 'value' | (string & {});
  pattern?: TenoraSelectSingleSearchPattern | RegExp;
};

export type TenoraSelectSingleVirtualConfig = {
  estimatedItemSize?: number;
  maxHeight?: number;
  overscan?: number;
};

export type TenoraSelectSingleSearch =
  | false
  | {
      rules?: readonly TenoraSelectSingleSearchRule[];
      placeholder?: string;
      debounceMs?: number;
    };

export type TenoraSelectSingleProps<T extends string = string> = {
  ariaLabel?: string;
  'aria-label'?: string;
  options: readonly TenoraSelectSingleOption<T>[];
  value?: T | '' | null;
  onChange: (value: T | '') => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  allowClear?: boolean;
  search?: TenoraSelectSingleSearch;
  /** Virtualize large result sets. `true` uses sensible defaults. */
  virtual?: boolean | TenoraSelectSingleVirtualConfig;
};
