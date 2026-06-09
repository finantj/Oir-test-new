import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExhibit, getItem } from '@/lib/store';
import ItemCard from '@/components/ItemCard';

export const dynamic = 'force-dynamic';

export default function ExhibitPage({ params }: { params: { slug: string } }) {
  const exhibit = getExhibit(params.slug);
  if (!exhibit) notFound();

  return (
    <main>
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-900 to-stone-800 text-stone-100">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <nav className="mb-3 text-sm">
            <Link href="/exhibits" className="text-amber-200 underline">
              Exhibits
            </Link>
          </nav>
          <h1 className="font-serif text-4xl font-bold">{exhibit.title}</h1>
          {exhibit.summary && <p className="mt-3 max-w-2xl text-lg text-stone-300">{exhibit.summary}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-4xl space-y-12 px-4 py-10">
        {exhibit.blocks.map((block, i) => {
          const items = block.itemIds
            .map((id) => getItem(id))
            .filter((item): item is NonNullable<typeof item> => item !== null);
          return (
            <section key={i}>
              {block.heading && (
                <h2 className="mb-3 font-serif text-2xl font-bold text-stone-900">{block.heading}</h2>
              )}
              {block.text && (
                <p className="mb-5 max-w-3xl whitespace-pre-wrap leading-relaxed text-stone-700">
                  {block.text}
                </p>
              )}
              {items.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
