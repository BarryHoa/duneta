'use client';

import { memo } from 'react';
import { TenoraDataTableToolbarSlots } from './TenoraDataTableToolbar';
import type { TenoraDataTableToolbarRegionProps } from './TenoraDataTableToolbarRegion.types';

export type { TenoraDataTableToolbarRegionProps } from './TenoraDataTableToolbarRegion.types';

function TenoraDataTableToolbarRegionInner(props: TenoraDataTableToolbarRegionProps) {
  return <TenoraDataTableToolbarSlots {...props} />;
}

export const TenoraDataTableToolbarRegion = memo(
  TenoraDataTableToolbarRegionInner,
) as typeof TenoraDataTableToolbarRegionInner;
