import { TenoraCard } from '../TenoraCard';

// Image preview card.

export type TenoraViewImageProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
};

export function TenoraViewImage({ src, alt, caption, className = '' }: TenoraViewImageProps) {
  return (
    <TenoraCard className={`overflow-hidden ${className}`}>
      <img className="block h-auto w-full object-cover" src={src} alt={alt} />
      {caption ? <TenoraCard.Footer className="text-sm text-slate-500">{caption}</TenoraCard.Footer> : null}
    </TenoraCard>
  );
}
