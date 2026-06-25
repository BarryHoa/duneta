'use client';

import { useRef, type ComponentProps } from 'react';
import { TenoraButton } from '../TenoraButton';
import { TenoraFlex } from '../TenoraLayout/TenoraFlex';

export type TenoraUploadProps = Omit<ComponentProps<'input'>, 'className' | 'type'> & {
  label?: string;
  className?: string;
};

export function TenoraUpload({ label = 'Choose file', className = '', ...inputProps }: TenoraUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <TenoraFlex className={`items-center gap-3 ${className}`}>
      <input ref={inputRef} className="sr-only" type="file" {...inputProps} />
      <TenoraButton variant="secondary" onPress={() => inputRef.current?.click()}>{label}</TenoraButton>
    </TenoraFlex>
  );
}
