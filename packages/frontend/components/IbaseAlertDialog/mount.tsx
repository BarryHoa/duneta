import { createRoot } from 'react-dom/client';
import { IbaseAlertDialog } from './IbaseAlertDialog';
import type { IbaseAlertDialogController, IbaseAlertDialogProps } from './types';

export function mountIbaseAlert(props: IbaseAlertDialogProps): IbaseAlertDialogController {
  if (typeof document === 'undefined') throw new Error('Ibase alert dialogs can only run in a browser.');
  const node = document.createElement('div'); document.body.appendChild(node);
  const root = createRoot(node); let closed = false;
  const controller = { close: () => { if (closed) return; closed = true; root.unmount(); node.remove(); } };
  root.render(<IbaseAlertDialog {...props} onOpenChange={(isOpen) => { props.onOpenChange(isOpen); if (!isOpen) controller.close(); }} />);
  return controller;
}
