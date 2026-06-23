import type { AlertDialogIconProps } from '@heroui/react';
import type { ReactNode } from 'react';

export type IbaseAlertDialogStatus = NonNullable<AlertDialogIconProps['status']>;
export type IbaseAlertDialogProps = {
  isOpen: boolean; onOpenChange: (isOpen: boolean) => void; title: ReactNode; description?: ReactNode; children?: ReactNode;
  status?: IbaseAlertDialogStatus; icon?: ReactNode; confirmLabel?: string; cancelLabel?: string;
  onConfirm?: () => void | Promise<void>; onCancel?: () => void | Promise<void>;
  isDismissable?: boolean; isKeyboardDismissDisabled?: boolean; size?: 'sm' | 'md' | 'lg';
  confirmVariant?: 'primary' | 'danger'; hideFooter?: boolean; className?: string;
};
export type IbaseAlertDialogController = { close: () => void };
export type IbaseAlertOptions = Omit<IbaseAlertDialogProps, 'isOpen' | 'onOpenChange' | 'status'>;
export type IbaseAlertSuccessOptions = IbaseAlertOptions & { status?: never; confirmVariant?: 'primary' };
export type IbaseAlertWarningOptions = IbaseAlertOptions & { status?: never; confirmVariant?: 'primary' | 'danger' };
export type IbaseAlertErrorOptions = IbaseAlertOptions & { status?: never; confirmVariant?: 'primary' | 'danger' };
export type IbaseConfirmOptions = IbaseAlertOptions & { onCancel?: () => void | Promise<void>; confirmVariant?: 'primary' | 'danger' };
export type IbaseConfirmResult = IbaseAlertDialogController & { isOk: boolean };
export type IbaseLoadingOptions = { title?: ReactNode; message?: ReactNode; size?: 'sm' | 'md' | 'lg' };
