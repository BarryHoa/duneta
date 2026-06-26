import { useEffect, useState } from 'react';

/** True after the first client paint — defers browser-only APIs (e.g. dnd-kit). */
export function useClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
