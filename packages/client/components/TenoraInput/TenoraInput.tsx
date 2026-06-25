import { Input } from '@heroui/react';
import type { InputProps } from '@heroui/react';

// Base HeroUI input for the Tenora input family.

export type TenoraInputProps = InputProps;

export function TenoraInput(props: TenoraInputProps) {
  return <Input {...props} />;
}
