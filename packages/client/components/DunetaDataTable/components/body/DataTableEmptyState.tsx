
type DataTableEmptyStateProps = {
  columnCount: number;
};

export function DataTableEmptyState({ columnCount }: DataTableEmptyStateProps) {
  return (
    <span className="block px-4 py-8 text-center text-sm text-muted" data-column-count={columnCount}>
      No results
    </span>
  );
}
