import { notFound } from 'next/navigation';
import { getExhibit, listItems } from '@/lib/store';
import ExhibitEditor from '@/components/ExhibitEditor';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Edit exhibit · Admin' };

export default function EditExhibitPage({ params }: { params: { slug: string } }) {
  const exhibit = getExhibit(params.slug);
  if (!exhibit) notFound();
  const items = listItems();
  return (
    <main>
      <h1 className="mb-6 font-serif text-3xl font-bold">Edit: {exhibit.title}</h1>
      <ExhibitEditor items={items} exhibit={exhibit} />
    </main>
  );
}
