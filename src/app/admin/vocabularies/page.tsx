import { getAllVocabularies } from '@/lib/store';
import VocabManager from '@/components/VocabManager';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Vocabularies · Admin' };

export default function VocabulariesPage() {
  const vocabularies = getAllVocabularies();
  return (
    <main>
      <h1 className="mb-1 font-serif text-3xl font-bold">Vocabularies</h1>
      <p className="mb-6 text-sm text-stone-500">
        Element sets available for describing artifacts, in the spirit of Omeka&apos;s element sets.
      </p>
      <VocabManager vocabularies={vocabularies} />
    </main>
  );
}
