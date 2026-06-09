import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllVocabularies, getItem, listItems } from '@/lib/store';
import { itemToJsonLd } from '@/lib/jsonld';
import { itemIdentifier, itemTitle } from '@/lib/itemUtils';
import { itemJsonLdHref, liveData } from '@/lib/liveData';
import { termLabel } from '@/lib/vocabularies';
import MetadataTable from '@/components/MetadataTable';
import ItemThumb from '@/components/ItemThumb';

export function generateStaticParams() {
  // Pre-render every item only for the static export; the server build renders
  // on demand so edits show up immediately.
  if (process.env.NEXT_PUBLIC_OIR_STATIC !== '1') return [];
  return listItems().map((item) => ({ id: item.id }));
}

export default function ItemPage({ params }: { params: { id: string } }) {
  liveData();
  const item = getItem(params.id);
  if (!item) notFound();
  const vocabs = getAllVocabularies();
  const jsonld = itemToJsonLd(item, vocabs);
  const identifier = itemIdentifier(item);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 text-sm text-stone-500">
        <Link href="/browse" className="text-emerald-800 underline">
          Browse
        </Link>{' '}
        / {itemTitle(item)}
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px,1fr]">
        <div className="space-y-4">
          <div className="card aspect-square overflow-hidden">
            <ItemThumb item={item} />
          </div>
          {item.media.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {item.media.slice(1).map((m, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={m.url}
                  alt={m.caption ?? ''}
                  className="card aspect-square w-full object-cover"
                />
              ))}
            </div>
          )}
          {item.media[0]?.caption && (
            <p className="text-xs text-stone-500">{item.media[0].caption}</p>
          )}
          <a href={itemJsonLdHref(item.id)} className="btn-secondary w-full justify-center">
            Download JSON-LD
          </a>
        </div>

        <div>
          {identifier && <p className="font-mono text-sm text-stone-400">{identifier}</p>}
          <h1 className="font-serif text-3xl font-bold text-stone-900">{itemTitle(item)}</h1>
          <div className="mb-6 mt-2 flex flex-wrap gap-1.5">
            {item.types.map((t) => (
              <span key={t} className="badge bg-stone-200 text-stone-700" title={t}>
                {termLabel(vocabs, t)}
              </span>
            ))}
          </div>

          <MetadataTable item={item} vocabularies={vocabs} />

          <details className="card mt-8 overflow-hidden">
            <summary className="cursor-pointer bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-700">
              Linked data (JSON-LD)
            </summary>
            <pre className="overflow-x-auto bg-stone-900 p-4 text-xs leading-relaxed text-emerald-100">
              {JSON.stringify(jsonld, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </main>
  );
}
