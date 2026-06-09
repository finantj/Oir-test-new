import Link from 'next/link';
import { getItem, listExhibits } from '@/lib/store';
import ItemThumb from '@/components/ItemThumb';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Exhibits · Oir Artifact Repository' };

export default function ExhibitsPage() {
  const exhibits = listExhibits();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 font-serif text-3xl font-bold text-stone-900">Exhibits</h1>
      <p className="mb-6 text-sm text-stone-500">
        Curated narratives built from the artifact catalogue.
      </p>
      {exhibits.length === 0 ? (
        <div className="card p-8 text-center text-sm text-stone-500">
          No exhibits have been published yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {exhibits.map((exhibit) => {
            const coverId = exhibit.blocks.flatMap((b) => b.itemIds)[0];
            const cover = coverId ? getItem(coverId) : null;
            return (
              <Link
                key={exhibit.slug}
                href={`/exhibits/${exhibit.slug}`}
                className="card group flex overflow-hidden hover:border-emerald-700/50 hover:shadow-md"
              >
                <div className="w-36 shrink-0 border-r border-stone-200">
                  {cover ? (
                    <ItemThumb item={cover} />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-stone-200 to-stone-300" />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-emerald-900">
                    {exhibit.title}
                  </h2>
                  {exhibit.summary && (
                    <p className="mt-1 line-clamp-3 text-sm text-stone-600">{exhibit.summary}</p>
                  )}
                  <p className="mt-2 text-xs text-stone-400">
                    {exhibit.blocks.reduce((n, b) => n + b.itemIds.length, 0)} artifacts
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
