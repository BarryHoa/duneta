import { mountIbaseAlert } from './mount';
import type { IbaseAlertDialogController, IbaseAlertErrorOptions } from './types';
export function showIbaseAlertError(options: IbaseAlertErrorOptions): IbaseAlertDialogController { return mountIbaseAlert({ ...options, status: 'danger', isOpen: true, onOpenChange: () => undefined }); }
