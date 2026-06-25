export const DEFAULT_TABLE_HEIGHT = 480;
export const TABLE_ROW_HEIGHT = 42;
export const TABLE_HEADER_HEIGHT = 42;

export const TABLE_STICKY_HEADER_CLASS = 'sticky top-0 z-10 bg-surface-secondary';

export const TABLE_SCROLL_CONTAINER_CLASS =
  'overflow-auto [scrollbar-gutter:stable]';

/** Let scrollbars render outside HeroUI `.table-root { overflow: clip }`. */
export const TABLE_ROOT_OVERFLOW_CLASS = '!overflow-visible';

/** Overrides HeroUI table ~32px corners (`.table-root--primary` / cell radii in table.css). */
export const TABLE_SHELL_RADIUS_CLASS =
  'rounded-lg [&_th.table__column:first-child]:!rounded-ss-lg [&_th.table__column:first-child]:!rounded-es-lg [&_th.table__column:last-child]:!rounded-se-lg [&_th.table__column:last-child]:!rounded-ee-lg [&_tbody_tr:first-child_td:first-child]:!rounded-ss-lg [&_tbody_tr:first-child_td:last-child]:!rounded-se-lg [&_tbody_tr:last-child_td:first-child]:!rounded-es-lg [&_tbody_tr:last-child_td:last-child]:!rounded-ee-lg';
