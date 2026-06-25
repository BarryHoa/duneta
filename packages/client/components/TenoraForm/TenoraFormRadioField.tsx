import { Description, FieldError, Label, Radio, RadioGroup } from '@heroui/react';
import type { RadioGroupProps } from '@heroui/react';
import type { ReactNode } from 'react';

// Radio group composition for forms.

export type TenoraFormRadioOption = { value: string; label: ReactNode; isDisabled?: boolean };
export type TenoraFormRadioFieldProps = Omit<RadioGroupProps, 'children' | 'label'> & { label: ReactNode; options: TenoraFormRadioOption[]; description?: ReactNode; error?: string; layout?: 'horizontal' | 'vertical' };

export function TenoraFormRadioField({ label, options, description, error, layout = 'vertical', isInvalid, ...props }: TenoraFormRadioFieldProps) {
  return <RadioGroup {...props} orientation={layout} isInvalid={isInvalid ?? Boolean(error)}><Label className="pb-1.5 text-sm font-medium">{label}</Label>{options.map((option) => <Radio key={option.value} value={option.value} isDisabled={option.isDisabled}><Radio.Control><Radio.Indicator /></Radio.Control><Radio.Content>{option.label}</Radio.Content></Radio>)}{description ? <Description className="text-xs text-slate-500">{description}</Description> : null}{error ? <FieldError>{error}</FieldError> : null}</RadioGroup>;
}
