'use client';

import {
  Button as HeroButton,
  Card as HeroCard,
  Input as HeroInput,
  NumberField as HeroNumberField,
  TextArea as HeroTextArea,
} from '@heroui/react';
import type {
  ButtonProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
  InputProps,
  NumberFieldProps,
  TextAreaProps,
} from '@heroui/react';
import { useRef, type ComponentProps, type PropsWithChildren } from 'react';

export function IbaseButton(props: ButtonProps) {
  return <HeroButton {...props} />;
}

function IbaseCardRoot(props: CardProps) { return <HeroCard {...props} />; }
function IbaseCardHeader(props: CardHeaderProps) { return <HeroCard.Header {...props} />; }
function IbaseCardTitle(props: CardTitleProps) { return <HeroCard.Title {...props} />; }
function IbaseCardDescription(props: CardDescriptionProps) { return <HeroCard.Description {...props} />; }
function IbaseCardContent(props: CardContentProps) { return <HeroCard.Content {...props} />; }
function IbaseCardFooter(props: CardFooterProps) { return <HeroCard.Footer {...props} />; }

export const IbaseCard = Object.assign(IbaseCardRoot, {
  Root: IbaseCardRoot,
  Header: IbaseCardHeader,
  Title: IbaseCardTitle,
  Description: IbaseCardDescription,
  Content: IbaseCardContent,
  Footer: IbaseCardFooter,
});

export function IbaseInput(props: InputProps) { return <HeroInput {...props} />; }
export function IbaseInputNumber(props: NumberFieldProps) { return <HeroNumberField {...props} />; }
export function IbaseTextArea(props: TextAreaProps) { return <HeroTextArea {...props} />; }

type IbaseInputProps = InputProps;

export function IbaseInputEmail(props: IbaseInputProps) {
  return <IbaseInput {...props} type="email" autoComplete="email" />;
}

export function IbaseInputPassword(props: IbaseInputProps) {
  return <IbaseInput {...props} type="password" autoComplete="current-password" />;
}

export function IbaseInputPhone(props: IbaseInputProps) {
  return <IbaseInput {...props} type="tel" inputMode="tel" autoComplete="tel" />;
}

type IbaseLayoutProps = PropsWithChildren<{
  className?: string;
}>;

export function IbaseFlex({ children, className = '' }: IbaseLayoutProps) {
  return <div className={`flex ${className}`}>{children}</div>;
}

export function IbaseBox({ children, className = '' }: IbaseLayoutProps) {
  return <div className={className}>{children}</div>;
}

type IbaseUploadProps = Omit<ComponentProps<'input'>, 'className' | 'type'> & {
  label?: string;
  className?: string;
};

export function IbaseUpload({ label = 'Choose file', className = '', ...inputProps }: IbaseUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <IbaseFlex className={`items-center gap-3 ${className}`}>
      <input ref={inputRef} className="sr-only" type="file" {...inputProps} />
      <IbaseButton variant="secondary" onPress={() => inputRef.current?.click()}>
        {label}
      </IbaseButton>
    </IbaseFlex>
  );
}

export function IbaseUploadImage(props: IbaseUploadProps) {
  return <IbaseUpload {...props} accept="image/*" label={props.label ?? 'Upload image'} />;
}

export function IbaseUploadFile(props: IbaseUploadProps) {
  return <IbaseUpload {...props} label={props.label ?? 'Upload file'} />;
}

type IbaseViewImageProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
};

export function IbaseViewImage({ src, alt, caption, className = '' }: IbaseViewImageProps) {
  return (
    <IbaseCard className={`overflow-hidden ${className}`}>
      <img className="block h-auto w-full object-cover" src={src} alt={alt} />
      {caption ? <IbaseCard.Footer className="text-sm text-slate-500">{caption}</IbaseCard.Footer> : null}
    </IbaseCard>
  );
}
