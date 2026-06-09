'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Exhibit } from '@/lib/types';

export default function AdminExhibitsTable({ exhibits }: { exhibits: Exhibit[] }) {
  const router = useRouter();

  const remove = async (slug: string, title: string) => {
    if (!window.confirm(`Delete exhibit "${title}"?`)) return;
    await fetch(`/api/exhibits/${slug}`, { method: 'DELETE' });
    router.refresh();
  };

  if (exhibits.length === 0) {
    return (
      <div className="card p-8 text-center text-sm text-stone-500">
        No exhibits yet.{' '}
        <Link href="/admin/exhibits/new" className="text-emerald-800 underline">
          Create one
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="card divide-y divide-stone-100">
      {exhibits.map((exhibit) => (
        <div key={exhibit.slug} className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <Link
              href={`/exhibits/${exhibit.slug}`}
              className="font-medium text-stone-900 hover:text-emerald-900 hover:underline"
            >
              {exhibit.title}
            </Link>
            <p className="text-xs text-stone-500">
              /{exhibit.slug} · {exhibit.blocks.length} section(s) ·{' '}
              {exhibit.blocks.reduce((n, b) => n + b.itemIds.length, 0)} artifact(s)
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href={`/admin/exhibits/${exhibit.slug}`} className="btn-secondary !px-2 !py-1 text-xs">
              Edit
            </Link>
            <button
              onClick={() => remove(exhibit.slug, exhibit.title)}
              className="btn-danger !px-2 !py-1 text-xs"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
