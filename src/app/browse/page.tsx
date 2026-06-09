import { listItems } from '@/lib/store';
import BrowseGallery from '@/components/BrowseGallery';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Browse · Oir Artifact Repository' };

export default function BrowsePage() {
  const items = listItems();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 font-serif text-3xl font-bold text-stone-900">Browse the finds</h1>
      <p className="mb-6 text-sm text-stone-500">
        Filter the artifact catalogue by object type, material, context, and period.
      </p>
      <BrowseGallery items={items} />
    </main>
  );
}
