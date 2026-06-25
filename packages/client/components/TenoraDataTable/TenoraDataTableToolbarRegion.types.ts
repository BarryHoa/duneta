import type { ReactNode } from 'react';
import type {
  TenoraDataTableColumnsUiConfig,
  TenoraDataTableFavoritesConfig,
  TenoraDataTableFilterConfig,
  TenoraDataTableGroupingConfig,
  TenoraDataTableRetryConfig,
  TenoraDataTableSearchConfig,
} from './types';

export type TenoraDataTableToolbarRegionProps = {
  search?: TenoraDataTableSearchConfig;
  retry?: TenoraDataTableRetryConfig;
  toolbar?: ReactNode;
  showColumnPanel?: boolean;
  favorites?: TenoraDataTableFavoritesConfig;
  filter?: TenoraDataTableFilterConfig;
  columnsUi?: TenoraDataTableColumnsUiConfig;
  grouping?: TenoraDataTableGroupingConfig;
};
