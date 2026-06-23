import { Button } from '@heroui/react';
import type { ButtonProps } from '@heroui/react';

export type IbaseButtonProps = ButtonProps;

export function IbaseButton(props: IbaseButtonProps) {
  return <Button {...props} />;
}
