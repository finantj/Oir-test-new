import Link from 'next/link';
import { listExhibits } from '@/lib/store';
import AdminExhibitsTable from '@/components/AdminExhibitsTable';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Exhibits · Admin' };

export default function AdminExhibitsPage() {
  const exhibits = listExhibits();
  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Exhibits</h1>
          <p className="text-sm text-stone-500">{exhibits.length} exhibit(s)</p>
        </div>
        <Link href="/admin/exhibits/new" className="btn-primary">
          + New exhibit
        </Link>
      </div>
      <AdminExhibitsTable exhibits={exhibits} />
    </main>
  );
}
