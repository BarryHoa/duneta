import { TABLE_HEADER_HEIGHT } from '../constants';

/** Scroll viewport = sticky header + body max-height. */
export function resolveTableScrollMaxHeight(
  bodyMaxHeight: number | string,
): number | string {
  if (typeof bodyMaxHeight === 'number') {
    return TABLE_HEADER_HEIGHT + bodyMaxHeight;
  }

  return `calc(${bodyMaxHeight} + ${TABLE_HEADER_HEIGHT}px)`;
}
