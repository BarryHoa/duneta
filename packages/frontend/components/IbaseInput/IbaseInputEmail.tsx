import { IbaseInput } from './IbaseInput';
import type { IbaseInputProps } from './IbaseInput';

// Email-specialized input.

export type IbaseInputEmailProps = Omit<IbaseInputProps, 'type' | 'autoComplete'>;

export function IbaseInputEmail(props: IbaseInputEmailProps) {
  return <IbaseInput {...props} type="email" autoComplete="email" />;
}
