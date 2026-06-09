'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ArtifactItem, Exhibit, ExhibitBlock } from '@/lib/types';
import { itemTitle } from '@/lib/itemUtils';

interface Props {
  items: ArtifactItem[];
  exhibit?: Exhibit | null;
}

export default function ExhibitEditor({ items, exhibit }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(exhibit?.title ?? '');
  const [slug, setSlug] = useState(exhibit?.slug ?? '');
  const [summary, setSummary] = useState(exhibit?.summary ?? '');
  const [blocks, setBlocks] = useState<ExhibitBlock[]>(
    exhibit?.blocks ?? [{ heading: '', text: '', itemIds: [] }],
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const updateBlock = (index: number, patch: Partial<ExhibitBlock>) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  };

  const toggleItem = (index: number, id: string) => {
    setBlocks((prev) =>
      prev.map((b, i) => {
        if (i !== index) return b;
        const itemIds = b.itemIds.includes(id)
          ? b.itemIds.filter((x) => x !== id)
          : [...b.itemIds, id];
        return { ...b, itemIds };
      }),
    );
  };

  const save = async () => {
    setError(null);
    if (!title.trim()) {
      setError('A title is required.');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/exhibits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug: slug || undefined,
        summary,
        blocks: blocks.map((b) => ({
          heading: b.heading?.trim() || undefined,
          text: b.text?.trim() || undefined,
          itemIds: b.itemIds,
        })),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? `Save failed (${res.status})`);
      return;
    }
    router.push('/admin/exhibits');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <section className="card space-y-3 p-4">
        <div>
          <label className="label">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">Slug (URL name — leave blank to derive from title)</label>
          <input
            className="input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={!!exhibit}
          />
        </div>
        <div>
          <label className="label">Summary</label>
          <textarea
            className="input min-h-[70px]"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
      </section>

      {blocks.map((block, i) => (
        <section key={i} className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold">Section {i + 1}</h2>
            <button
              onClick={() => setBlocks((prev) => prev.filter((_, j) => j !== i))}
              className="text-sm text-stone-400 hover:text-red-700"
            >
              Remove section
            </button>
          </div>
          <div className="space-y-3">
            <input
              className="input"
              value={block.heading ?? ''}
              onChange={(e) => updateBlock(i, { heading: e.target.value })}
              placeholder="Section heading (optional)"
            />
            <textarea
              className="input min-h-[100px]"
              value={block.text ?? ''}
              onChange={(e) => updateBlock(i, { text: e.target.value })}
              placeholder="Narrative text (optional)"
            />
            <div>
              <p className="label">Artifacts in this section</p>
              {items.length === 0 ? (
                <p className="text-sm text-stone-400">No items in the repository yet.</p>
              ) : (
                <div className="grid max-h-48 grid-cols-1 gap-1 overflow-y-auto rounded-md border border-stone-200 p-2 sm:grid-cols-2">
                  {items.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={block.itemIds.includes(item.id)}
                        onChange={() => toggleItem(i, item.id)}
                      />
                      {itemTitle(item)}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      <button
        className="btn-secondary"
        onClick={() => setBlocks((prev) => [...prev, { heading: '', text: '', itemIds: [] }])}
      >
        + Add section
      </button>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : exhibit ? 'Save exhibit' : 'Create exhibit'}
        </button>
        <button className="btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </div>
  );
}
