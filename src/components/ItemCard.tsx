import Link from 'next/link';
import type { ArtifactItem } from '@/lib/types';
import {
  itemContext,
  itemIdentifier,
  itemMaterial,
  itemObjectType,
  itemTitle,
} from '@/lib/itemUtils';
import ItemThumb from './ItemThumb';

export default function ItemCard({ item }: { item: ArtifactItem }) {
  const identifier = itemIdentifier(item);
  const objectType = itemObjectType(item);
  const material = itemMaterial(item);
  const context = itemContext(item);
  return (
    <Link href={`/items/${item.id}`} className="card group block overflow-hidden hover:border-emerald-700/50 hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden border-b border-stone-200">
        <ItemThumb item={item} className="transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="space-y-1.5 p-3">
        {identifier && (
          <p className="font-mono text-xs text-stone-400">{identifier}</p>
        )}
        <h3 className="font-serif text-base font-semibold leading-snug text-stone-900 group-hover:text-emerald-900">
          {itemTitle(item)}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {objectType && <span className="badge bg-emerald-50 text-emerald-900">{objectType}</span>}
          {material && <span className="badge bg-amber-50 text-amber-900">{material}</span>}
        </div>
        {context && <p className="text-xs text-stone-500">{context}</p>}
      </div>
    </Link>
  );
}
