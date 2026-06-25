import { mountTenoraAlert } from './mount';
import type { TenoraAlertDialogController, TenoraAlertSuccessOptions } from './types';
export function showTenoraAlertSuccess(options: TenoraAlertSuccessOptions): TenoraAlertDialogController { return mountTenoraAlert({ ...options, status: 'success', isOpen: true, onOpenChange: () => undefined }); }
