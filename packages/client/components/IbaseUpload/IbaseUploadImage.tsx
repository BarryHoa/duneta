import { IbaseUpload } from './IbaseUpload';
import type { IbaseUploadProps } from './IbaseUpload';

// Image upload defaults.

export type IbaseUploadImageProps = IbaseUploadProps;

export function IbaseUploadImage(props: IbaseUploadImageProps) {
  return <IbaseUpload {...props} accept="image/*" label={props.label ?? 'Upload image'} />;
}
