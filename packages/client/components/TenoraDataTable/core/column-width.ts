import type { TenoraTableColumnProps } from '../../TenoraTable';
import type {
  ColumnWidthValue,
  TenoraDataTableColumnMeta,
} from '../types/column-meta';

export const DEFAULT_COLUMN_MIN_WIDTH_PX = 80;

type ResolvedColumnWidthProps = Pick<
  TenoraTableColumnProps,
  'defaultWidth' | 'minWidth' | 'maxWidth'
>;

function parsePx(value: string): number | undefined {
  const match = /^(\d+(?:\.\d+)?)px$/i.exec(value.trim());
  return match ? Number(match[1]) : undefined;
}

function toPxNumber(value: ColumnWidthValue | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return parsePx(value);
}

function clampWidth(
  width: number,
  minWidth: number,
  maxWidth?: number,
): number {
  const aboveMin = Math.max(width, minWidth);
  return maxWidth !== undefined ? Math.min(aboveMin, maxWidth) : aboveMin;
}

function resolveMinWidth(meta?: TenoraDataTableColumnMeta): number {
  const min = meta?.minWidth;
  if (min === undefined) return DEFAULT_COLUMN_MIN_WIDTH_PX;
  return toPxNumber(min) ?? DEFAULT_COLUMN_MIN_WIDTH_PX;
}

function resolveMaxWidthPx(
  meta?: TenoraDataTableColumnMeta,
): number | undefined {
  const max = meta?.maxWidth;
  if (max === undefined || max === 'auto') return undefined;
  if (typeof max === 'number') return max;
  return toPxNumber(max);
}

export function resolveColumnWidthProps(
  meta?: TenoraDataTableColumnMeta,
): ResolvedColumnWidthProps {
  const minWidth = resolveMinWidth(meta);
  const maxWidth = resolveMaxWidthPx(meta);

  const rawDefault = meta?.defaultWidth;
  let defaultWidth: ResolvedColumnWidthProps['defaultWidth'];

  if (rawDefault === undefined || rawDefault === 'auto') {
    defaultWidth = '1fr' as const;
  } else if (typeof rawDefault === 'number') {
    defaultWidth = clampWidth(rawDefault, minWidth, maxWidth);
  } else if (/^\d+fr$/.test(rawDefault)) {
    defaultWidth = rawDefault as `${number}fr`;
  } else {
    const parsed = toPxNumber(rawDefault);
    defaultWidth =
      parsed !== undefined
        ? clampWidth(parsed, minWidth, maxWidth)
        : undefined;
  }

  return {
    defaultWidth,
    minWidth,
    ...(maxWidth !== undefined ? { maxWidth } : {}),
  };
}
