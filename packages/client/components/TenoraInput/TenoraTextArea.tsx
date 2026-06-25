import { TextArea } from '@heroui/react';
import type { TextAreaProps } from '@heroui/react';

// Base HeroUI textarea.

export type TenoraTextAreaProps = TextAreaProps;

export function TenoraTextArea(props: TenoraTextAreaProps) {
  return <TextArea {...props} />;
}
