export type ColumnWidthValue = number | string;

/** Initial column width. `auto` / omitted shares free space (`1fr`). */
export type ColumnDefaultWidth = 'auto' | ColumnWidthValue | undefined;

/** Max width. `auto` / omitted = no upper bound while resizing. */
export type ColumnMaxWidth = 'auto' | ColumnWidthValue | undefined;

export type TenoraDataTableColumnMeta = {
  defaultWidth?: ColumnDefaultWidth;
  minWidth?: ColumnWidthValue | undefined;
  maxWidth?: ColumnMaxWidth;
};

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> extends TenoraDataTableColumnMeta {}
}
