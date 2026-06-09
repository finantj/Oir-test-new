import type { ArtifactItem } from '@/lib/types';
import { itemTitle } from '@/lib/itemUtils';

export default function ItemThumb({
  item,
  className = '',
}: {
  item: ArtifactItem;
  className?: string;
}) {
  const media = item.media[0];
  if (media) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.url}
        alt={media.caption ?? itemTitle(item)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300 text-stone-500 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-10 w-10">
        <path d="M8 3h8c0 2-1 3-2 4v3c3 1 5 3.5 5 7 0 2.5-2 4-4 4H9c-2 0-4-1.5-4-4 0-3.5 2-6 5-7V7C9 6 8 5 8 3Z" />
      </svg>
    </div>
  );
}
