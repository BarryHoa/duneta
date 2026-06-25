import { mountTenoraAlert } from './mount';
import type { TenoraAlertDialogController, TenoraAlertErrorOptions } from './types';
export function showTenoraAlertError(options: TenoraAlertErrorOptions): TenoraAlertDialogController { return mountTenoraAlert({ ...options, status: 'danger', isOpen: true, onOpenChange: () => undefined }); }
