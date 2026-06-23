import { TextArea } from '@heroui/react';
import type { TextAreaProps } from '@heroui/react';

// Base HeroUI textarea.

export type IbaseTextAreaProps = TextAreaProps;

export function IbaseTextArea(props: IbaseTextAreaProps) {
  return <TextArea {...props} />;
}
