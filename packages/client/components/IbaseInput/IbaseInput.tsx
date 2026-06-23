import { Input } from '@heroui/react';
import type { InputProps } from '@heroui/react';

// Base HeroUI input for the Tenora input family.

export type IbaseInputProps = InputProps;

export function IbaseInput(props: IbaseInputProps) {
  return <Input {...props} />;
}
