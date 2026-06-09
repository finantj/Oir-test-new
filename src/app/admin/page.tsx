import Link from 'next/link';
import { getAllVocabularies, listExhibits, listItems } from '@/lib/store';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Admin · Oir Artifact Repository' };

export default function AdminDashboard() {
  const items = listItems();
  const exhibits = listExhibits();
  const vocabs = getAllVocabularies();

  const cards = [
    {
      href: '/admin/items',
      title: 'Items',
      count: items.length,
      text: 'Create, edit, and delete artifact records.',
    },
    {
      href: '/admin/import',
      title: 'Import',
      count: null,
      text: 'Ingest JSON-LD documents — single items or whole graphs.',
    },
    {
      href: '/admin/exhibits',
      title: 'Exhibits',
      count: exhibits.length,
      text: 'Curate narrative exhibits from catalogued items.',
    },
    {
      href: '/admin/vocabularies',
      title: 'Vocabularies',
      count: vocabs.length,
      text: 'Dublin Core, CIDOC CRM, Schema.org, plus your own.',
    },
  ];

  return (
    <main>
      <h1 className="mb-1 font-serif text-3xl font-bold">Administration</h1>
      <p className="mb-6 text-sm text-stone-500">
        Manage the artifact repository. All records are stored as JSON-LD files in the{' '}
        <code className="rounded bg-stone-200 px-1">data/</code> directory.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="card block p-5 hover:border-emerald-700/50 hover:shadow-md">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-semibold text-stone-900">{card.title}</h2>
              {card.count !== null && (
                <span className="font-serif text-2xl font-bold text-emerald-900">{card.count}</span>
              )}
            </div>
            <p className="mt-1 text-sm text-stone-500">{card.text}</p>
          </Link>
        ))}
      </div>
      <div className="card mt-6 p-5">
        <h2 className="font-serif text-lg font-semibold">Data export</h2>
        <p className="mt-1 text-sm text-stone-500">
          The whole catalogue can be exported as a single JSON-LD graph.
        </p>
        <a href="/api/export" className="btn-secondary mt-3">
          Download collection.jsonld
        </a>
      </div>
    </main>
  );
}
