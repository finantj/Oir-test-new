'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ArtifactItem } from '@/lib/types';
import { itemIdentifier, itemObjectType, itemTitle } from '@/lib/itemUtils';

export default function AdminItemsTable({ items }: { items: ArtifactItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const remove = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? The JSON-LD file will be removed.`)) return;
    setBusy(id);
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    setBusy(null);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center text-sm text-stone-500">
        No items yet. <Link href="/admin/items/new" className="text-emerald-800 underline">Create one</Link> or{' '}
        <Link href="/admin/import" className="text-emerald-800 underline">import JSON-LD</Link>.
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th className="px-4 py-2.5">Identifier</th>
            <th className="px-4 py-2.5">Title</th>
            <th className="px-4 py-2.5">Type</th>
            <th className="px-4 py-2.5">Fields</th>
            <th className="px-4 py-2.5">Updated</th>
            <th className="px-4 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-stone-50">
              <td className="px-4 py-2.5 font-mono text-xs text-stone-500">
                {itemIdentifier(item) ?? item.id}
              </td>
              <td className="px-4 py-2.5 font-medium text-stone-900">
                <Link href={`/items/${item.id}`} className="hover:text-emerald-900 hover:underline">
                  {itemTitle(item)}
                </Link>
                {item.featured && <span className="badge ml-2 bg-amber-100 text-amber-900">featured</span>}
              </td>
              <td className="px-4 py-2.5 text-stone-600">{itemObjectType(item) ?? '—'}</td>
              <td className="px-4 py-2.5 text-stone-600">{item.properties.length}</td>
              <td className="px-4 py-2.5 text-xs text-stone-500">
                {new Date(item.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2.5 text-right">
                <div className="inline-flex gap-2">
                  <Link href={`/admin/items/${item.id}`} className="btn-secondary !px-2 !py-1 text-xs">
                    Edit
                  </Link>
                  <button
                    onClick={() => remove(item.id, itemTitle(item))}
                    disabled={busy === item.id}
                    className="btn-danger !px-2 !py-1 text-xs disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
