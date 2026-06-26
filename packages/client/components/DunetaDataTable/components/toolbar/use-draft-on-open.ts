import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

/**
 * Panel draft state: copies `applied` into draft whenever the popover opens.
 * Use for Apply-to-commit flows (group, column visibility, …).
 */
export function useDraftOnOpen<T>(
  open: boolean,
  applied: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [draft, setDraft] = useState(applied);

  useEffect(() => {
    if (open) setDraft(applied);
  }, [applied, open]);

  return [draft, setDraft];
}
