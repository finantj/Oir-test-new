import Link from 'next/link';
import { getAllVocabularies, listExhibits, listItems } from '@/lib/store';
import { isStaticBuild, liveData } from '@/lib/liveData';
import ItemCard from '@/components/ItemCard';

export default function Home() {
  liveData();
  const items = listItems();
  const exhibits = listExhibits();
  const vocabs = getAllVocabularies();
  const featured = items.filter((i) => i.featured).slice(0, 4);
  const showcase = featured.length > 0 ? featured : items.slice(0, 4);

  return (
    <main>
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-900 to-stone-800 text-stone-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-300">
            Excavation archive · Linked open data
          </p>
          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
            The artifact record of the excavation, published as linked data.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-300">
            Every find in this repository is a JSON-LD document described with Dublin Core,
            CIDOC CRM, and other vocabularies — browsable as a catalogue, curated into
            exhibits, and downloadable as machine-readable data.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/browse" className="btn bg-amber-300 font-semibold text-stone-900 hover:bg-amber-200">
              Browse the finds
            </Link>
            <Link href="/exhibits" className="btn border border-stone-500 text-stone-100 hover:bg-stone-700">
              View exhibits
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-5 text-center">
            <p className="font-serif text-4xl font-bold text-emerald-900">{items.length}</p>
            <p className="mt-1 text-sm text-stone-500">Catalogued artifacts</p>
          </div>
          <div className="card p-5 text-center">
            <p className="font-serif text-4xl font-bold text-emerald-900">{exhibits.length}</p>
            <p className="mt-1 text-sm text-stone-500">Exhibits</p>
          </div>
          <div className="card p-5 text-center">
            <p className="font-serif text-4xl font-bold text-emerald-900">{vocabs.length}</p>
            <p className="mt-1 text-sm text-stone-500">Metadata vocabularies</p>
          </div>
        </div>
      </section>

      {showcase.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              {featured.length > 0 ? 'Featured finds' : 'From the catalogue'}
            </h2>
            <Link href="/browse" className="text-sm text-emerald-800 underline">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {items.length === 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="card p-8 text-center">
            <h2 className="font-serif text-xl font-bold">The repository is empty</h2>
            <p className="mt-2 text-sm text-stone-500">
              Import JSON-LD records or create items by hand in the admin area.
            </p>
            {!isStaticBuild && (
              <Link href="/admin/import" className="btn-primary mt-4">
                Import JSON-LD
              </Link>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
