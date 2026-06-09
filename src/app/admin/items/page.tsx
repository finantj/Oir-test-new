import Link from 'next/link';
import { listItems } from '@/lib/store';
import AdminItemsTable from '@/components/AdminItemsTable';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Items · Admin' };

export default function AdminItemsPage() {
  const items = listItems();
  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Items</h1>
          <p className="text-sm text-stone-500">{items.length} artifact records</p>
        </div>
        <Link href="/admin/items/new" className="btn-primary">
          + New item
        </Link>
      </div>
      <AdminItemsTable items={items} />
    </main>
  );
}
