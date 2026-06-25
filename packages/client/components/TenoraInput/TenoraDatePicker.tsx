import dayjs, { type ConfigType } from 'dayjs';
import { TenoraInput } from './TenoraInput';
import type { TenoraInputProps } from './types';

// Native date input normalized with dayjs.

export type TenoraDatePickerProps = Omit<TenoraInputProps, 'type' | 'value' | 'defaultValue'> & {
  value?: ConfigType | null;
  defaultValue?: ConfigType | null;
};

function toDateInputValue(value: ConfigType | null | undefined): string | undefined {
  if (value == null) return undefined;
  const date = dayjs(value);
  return date.isValid() ? date.format('YYYY-MM-DD') : '';
}

export function TenoraDatePicker({ value, defaultValue, ...props }: TenoraDatePickerProps) {
  return <TenoraInput {...props} type="date" value={toDateInputValue(value)} defaultValue={toDateInputValue(defaultValue)} />;
}
