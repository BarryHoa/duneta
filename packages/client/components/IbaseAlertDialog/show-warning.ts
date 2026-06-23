import { mountIbaseAlert } from './mount';
import type { IbaseAlertDialogController, IbaseAlertWarningOptions } from './types';
export function showIbaseAlertWarning(options: IbaseAlertWarningOptions): IbaseAlertDialogController { return mountIbaseAlert({ ...options, status: 'warning', isOpen: true, onOpenChange: () => undefined }); }
