import { TenoraInput } from './TenoraInput';
import type { TenoraInputProps } from './types';

// Phone-specialized input.

export type TenoraInputPhoneProps = Omit<TenoraInputProps, 'type' | 'inputMode' | 'autoComplete'>;

export function TenoraInputPhone(props: TenoraInputPhoneProps) {
  return <TenoraInput {...props} type="tel" inputMode="tel" autoComplete="tel" />;
}
