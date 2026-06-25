import { createRoot } from 'react-dom/client';
import { TenoraAlertDialog } from './TenoraAlertDialog';
import type { TenoraAlertDialogController, TenoraAlertDialogProps } from './types';

export function mountTenoraAlert(props: TenoraAlertDialogProps): TenoraAlertDialogController {
  if (typeof document === 'undefined') throw new Error('Tenora alert dialogs can only run in a browser.');
  const node = document.createElement('div'); document.body.appendChild(node);
  const root = createRoot(node); let closed = false;
  const controller = { close: () => { if (closed) return; closed = true; root.unmount(); node.remove(); } };
  root.render(<TenoraAlertDialog {...props} onOpenChange={(isOpen) => { props.onOpenChange(isOpen); if (!isOpen) controller.close(); }} />);
  return controller;
}
