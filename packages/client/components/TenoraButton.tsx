import { Button } from '@heroui/react';
import type { ButtonProps } from '@heroui/react';

export type TenoraButtonProps = ButtonProps;

export function TenoraButton(props: TenoraButtonProps) {
  return <Button {...props} />;
}
