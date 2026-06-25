import type {
  TenoraDataTableDataType,
  TenoraDataTablePaginationConfig,
} from '../types';

export function isDynamicDataType(
  dataType: TenoraDataTableDataType | undefined,
): boolean {
  return dataType !== 'static';
}

export function resolveFooterPagination(
  dataType: TenoraDataTableDataType | undefined,
  dataLength: number,
  pagination: TenoraDataTablePaginationConfig,
): TenoraDataTablePaginationConfig & { total: number } {
  const total = isDynamicDataType(dataType)
    ? (pagination.total ?? dataLength)
    : dataLength;

  return { ...pagination, total };
}
