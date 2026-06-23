import { IbaseInput } from './IbaseInput';
import type { IbaseInputProps } from './IbaseInput';

// Phone-specialized input.

export type IbaseInputPhoneProps = Omit<IbaseInputProps, 'type' | 'inputMode' | 'autoComplete'>;

export function IbaseInputPhone(props: IbaseInputPhoneProps) {
  return <IbaseInput {...props} type="tel" inputMode="tel" autoComplete="tel" />;
}
