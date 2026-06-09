import { notFound } from 'next/navigation';
import { getAllVocabularies, getItem } from '@/lib/store';
import { itemTitle } from '@/lib/itemUtils';
import ItemEditor from '@/components/ItemEditor';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Edit item · Admin' };

export default function EditItemPage({ params }: { params: { id: string } }) {
  const item = getItem(params.id);
  if (!item) notFound();
  const vocabularies = getAllVocabularies();
  return (
    <main>
      <h1 className="mb-1 font-serif text-3xl font-bold">Edit: {itemTitle(item)}</h1>
      <p className="mb-6 text-sm text-stone-500">
        Stored as <code className="rounded bg-stone-200 px-1">data/items/{item.id}.jsonld</code>
      </p>
      <ItemEditor vocabularies={vocabularies} item={item} />
    </main>
  );
}
