import dayjs, { type ConfigType } from 'dayjs';
import { IbaseInput } from './IbaseInput';
import type { IbaseInputProps } from './IbaseInput';

// Native date input normalized with dayjs.

export type IbaseDatePickerProps = Omit<IbaseInputProps, 'type' | 'value' | 'defaultValue'> & {
  value?: ConfigType | null;
  defaultValue?: ConfigType | null;
};

function toDateInputValue(value: ConfigType | null | undefined): string | undefined {
  if (value == null) return undefined;
  const date = dayjs(value);
  return date.isValid() ? date.format('YYYY-MM-DD') : '';
}

export function IbaseDatePicker({ value, defaultValue, ...props }: IbaseDatePickerProps) {
  return <IbaseInput {...props} type="date" value={toDateInputValue(value)} defaultValue={toDateInputValue(defaultValue)} />;
}
