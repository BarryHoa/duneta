'use client';

import { useRef, type ComponentProps } from 'react';
import { IbaseButton } from '../IbaseButton';
import { IbaseFlex } from '../IbaseLayout/IbaseFlex';

export type IbaseUploadProps = Omit<ComponentProps<'input'>, 'className' | 'type'> & {
  label?: string;
  className?: string;
};

export function IbaseUpload({ label = 'Choose file', className = '', ...inputProps }: IbaseUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <IbaseFlex className={`items-center gap-3 ${className}`}>
      <input ref={inputRef} className="sr-only" type="file" {...inputProps} />
      <IbaseButton variant="secondary" onPress={() => inputRef.current?.click()}>{label}</IbaseButton>
    </IbaseFlex>
  );
}
