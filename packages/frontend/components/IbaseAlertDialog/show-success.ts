import { mountIbaseAlert } from './mount';
import type { IbaseAlertDialogController, IbaseAlertSuccessOptions } from './types';
export function showIbaseAlertSuccess(options: IbaseAlertSuccessOptions): IbaseAlertDialogController { return mountIbaseAlert({ ...options, status: 'success', isOpen: true, onOpenChange: () => undefined }); }
