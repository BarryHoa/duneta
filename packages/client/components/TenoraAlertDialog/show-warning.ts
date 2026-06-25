import { mountTenoraAlert } from './mount';
import type { TenoraAlertDialogController, TenoraAlertWarningOptions } from './types';
export function showTenoraAlertWarning(options: TenoraAlertWarningOptions): TenoraAlertDialogController { return mountTenoraAlert({ ...options, status: 'warning', isOpen: true, onOpenChange: () => undefined }); }
