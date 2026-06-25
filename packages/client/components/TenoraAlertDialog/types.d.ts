import type { AlertDialogIconProps } from '@heroui/react';
import type { ReactNode } from 'react';

export type TenoraAlertDialogStatus = NonNullable<AlertDialogIconProps['status']>;
export type TenoraAlertDialogProps = {
  isOpen: boolean; onOpenChange: (isOpen: boolean) => void; title: ReactNode; description?: ReactNode; children?: ReactNode;
  status?: TenoraAlertDialogStatus; icon?: ReactNode; confirmLabel?: string; cancelLabel?: string;
  onConfirm?: () => void | Promise<void>; onCancel?: () => void | Promise<void>;
  isDismissable?: boolean; isKeyboardDismissDisabled?: boolean; size?: 'sm' | 'md' | 'lg';
  confirmVariant?: 'primary' | 'danger'; hideFooter?: boolean; className?: string;
};
export type TenoraAlertDialogController = { close: () => void };
export type TenoraAlertOptions = Omit<TenoraAlertDialogProps, 'isOpen' | 'onOpenChange' | 'status'>;
export type TenoraAlertSuccessOptions = TenoraAlertOptions & { status?: never; confirmVariant?: 'primary' };
export type TenoraAlertWarningOptions = TenoraAlertOptions & { status?: never; confirmVariant?: 'primary' | 'danger' };
export type TenoraAlertErrorOptions = TenoraAlertOptions & { status?: never; confirmVariant?: 'primary' | 'danger' };
export type TenoraConfirmOptions = TenoraAlertOptions & { onCancel?: () => void | Promise<void>; confirmVariant?: 'primary' | 'danger' };
export type TenoraConfirmResult = TenoraAlertDialogController & { isOk: boolean };
export type TenoraLoadingOptions = { title?: ReactNode; message?: ReactNode; size?: 'sm' | 'md' | 'lg' };
