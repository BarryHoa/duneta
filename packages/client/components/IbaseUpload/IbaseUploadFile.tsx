import { IbaseUpload } from './IbaseUpload';
import type { IbaseUploadProps } from './IbaseUpload';

// File upload defaults.

export type IbaseUploadFileProps = IbaseUploadProps;

export function IbaseUploadFile(props: IbaseUploadFileProps) {
  return <IbaseUpload {...props} label={props.label ?? 'Upload file'} />;
}
