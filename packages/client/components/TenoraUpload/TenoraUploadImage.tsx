import { TenoraUpload } from './TenoraUpload';
import type { TenoraUploadProps } from './TenoraUpload';

// Image upload defaults.

export type TenoraUploadImageProps = TenoraUploadProps;

export function TenoraUploadImage(props: TenoraUploadImageProps) {
  return <TenoraUpload {...props} accept="image/*" label={props.label ?? 'Upload image'} />;
}
