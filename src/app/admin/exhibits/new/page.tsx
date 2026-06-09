import { listItems } from '@/lib/store';
import ExhibitEditor from '@/components/ExhibitEditor';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'New exhibit · Admin' };

export default function NewExhibitPage() {
  const items = listItems();
  return (
    <main>
      <h1 className="mb-1 font-serif text-3xl font-bold">New exhibit</h1>
      <p className="mb-6 text-sm text-stone-500">
        Build a narrative from sections of text and selected artifacts.
      </p>
      <ExhibitEditor items={items} />
    </main>
  );
}
