import { useState, type Dispatch, type SetStateAction } from 'react';

/**
 * Panel draft state: copies `applied` into draft whenever the popover opens.
 * Use for Apply-to-commit flows (group, column visibility, …).
 */
export function useDraftOnOpen<T>(
  open: boolean,
  applied: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [draft, setDraft] = useState(applied);
  const [syncKey, setSyncKey] = useState({ open, applied });

  if (open && (syncKey.open !== open || syncKey.applied !== applied)) {
    setSyncKey({ open, applied });
    setDraft(applied);
  } else if (!open && syncKey.open) {
    setSyncKey({ open, applied });
  }

  return [draft, setDraft];
}
