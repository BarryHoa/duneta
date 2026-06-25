import { TenoraInput } from './TenoraInput';
import type { TenoraInputProps } from './types';

// Email-specialized input.

export type TenoraInputEmailProps = Omit<TenoraInputProps, 'type' | 'autoComplete'>;

export function TenoraInputEmail(props: TenoraInputEmailProps) {
  return <TenoraInput {...props} type="email" autoComplete="email" />;
}
