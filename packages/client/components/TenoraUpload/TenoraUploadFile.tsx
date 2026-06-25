import { TenoraUpload } from './TenoraUpload';
import type { TenoraUploadProps } from './TenoraUpload';

// File upload defaults.

export type TenoraUploadFileProps = TenoraUploadProps;

export function TenoraUploadFile(props: TenoraUploadFileProps) {
  return <TenoraUpload {...props} label={props.label ?? 'Upload file'} />;
}
