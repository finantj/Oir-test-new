import { getAllVocabularies } from '@/lib/store';
import ImportTool from '@/components/ImportTool';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Import · Admin' };

export default function ImportPage() {
  const vocabularies = getAllVocabularies();
  return (
    <main>
      <h1 className="mb-1 font-serif text-3xl font-bold">Import JSON-LD</h1>
      <p className="mb-6 text-sm text-stone-500">
        Ingest artifact records from JSON-LD documents. Each imported node becomes an item file
        in the repository.
      </p>
      <ImportTool vocabularies={vocabularies} />
    </main>
  );
}
