import { getAllVocabularies } from '@/lib/store';
import ItemEditor from '@/components/ItemEditor';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'New item · Admin' };

export default function NewItemPage() {
  const vocabularies = getAllVocabularies();
  return (
    <main>
      <h1 className="mb-1 font-serif text-3xl font-bold">New item</h1>
      <p className="mb-6 text-sm text-stone-500">
        Describe an artifact using fields from any registered vocabulary.
      </p>
      <ItemEditor vocabularies={vocabularies} />
    </main>
  );
}
