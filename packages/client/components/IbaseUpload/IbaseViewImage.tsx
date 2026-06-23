import { IbaseCard } from '../IbaseCard';

// Image preview card.

export type IbaseViewImageProps = {
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
