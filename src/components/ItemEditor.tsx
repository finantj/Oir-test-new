'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ArtifactItem, MediaRef, PropertyValue, Vocabulary } from '@/lib/types';
import { termLabel } from '@/lib/vocabularies';

interface Props {
  vocabularies: Vocabulary[];
  item?: ArtifactItem | null;
}

export default function ItemEditor({ vocabularies, item }: Props) {
  const router = useRouter();
  const [iri, setIri] = useState(item?.iri ?? '');
  const [types, setTypes] = useState<string[]>(item?.types ?? ['crm:E22_Human-Made_Object']);
  const [properties, setProperties] = useState<PropertyValue[]>(
    item?.properties ?? [
      { term: 'dcterms:title', value: '' },
      { term: 'dcterms:identifier', value: '' },
      { term: 'dcterms:description', value: '' },
    ],
  );
  const [media, setMedia] = useState<MediaRef[]>(item?.media ?? []);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [newField, setNewField] = useState('');
  const [customField, setCustomField] = useState('');
  const [newType, setNewType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const updateProperty = (index: number, patch: Partial<PropertyValue>) => {
    setProperties((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const addField = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setProperties((prev) => [...prev, { term: t, value: '' }]);
  };

  const save = async () => {
    setError(null);
    const cleaned = properties
      .map((p) => ({ ...p, value: p.value.trim(), lang: p.lang?.trim() || undefined }))
      .filter((p) => p.value.length > 0);
    if (cleaned.length === 0) {
      setError('Add at least one metadata value (a title, for example).');
      return;
    }
    setSaving(true);
    const payload = {
      iri: iri.trim() || undefined,
      types,
      properties: cleaned,
      media: media.filter((m) => m.url.trim().length > 0),
      featured,
    };
    const res = item
      ? await fetch(`/api/items/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? `Save failed (${res.status})`);
      return;
    }
    router.push('/admin/items');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Classes */}
      <section className="card p-4">
        <h2 className="mb-3 font-serif text-lg font-semibold">Classification</h2>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {types.map((t) => (
            <span key={t} className="badge gap-1 bg-stone-200 text-stone-700">
              {t}
              <button
                onClick={() => setTypes((prev) => prev.filter((x) => x !== t))}
                className="text-stone-500 hover:text-red-700"
                aria-label={`Remove type ${t}`}
              >
                ×
              </button>
            </span>
          ))}
          {types.length === 0 && <span className="text-sm text-stone-400">No classes assigned.</span>}
        </div>
        <div className="flex gap-2">
          <select className="input" value={newType} onChange={(e) => setNewType(e.target.value)}>
            <option value="">Add a class…</option>
            {vocabularies.map((v) => (
              <optgroup key={v.prefix} label={v.label}>
                {v.classes.map((c) => (
                  <option key={c.term} value={`${v.prefix}:${c.term}`}>
                    {c.label} ({v.prefix}:{c.term})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            className="btn-secondary shrink-0"
            onClick={() => {
              if (newType && !types.includes(newType)) setTypes((prev) => [...prev, newType]);
              setNewType('');
            }}
          >
            Add
          </button>
        </div>
      </section>

      {/* Metadata fields */}
      <section className="card p-4">
        <h2 className="mb-3 font-serif text-lg font-semibold">Metadata</h2>
        <div className="space-y-3">
          {properties.map((prop, i) => (
            <div key={i} className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-medium text-stone-800">
                    {termLabel(vocabularies, prop.term)}
                  </span>
                  <span className="ml-2 font-mono text-xs text-stone-400">{prop.term}</span>
                </div>
                <button
                  onClick={() => setProperties((prev) => prev.filter((_, j) => j !== i))}
                  className="text-sm text-stone-400 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <textarea
                className="input min-h-[38px]"
                rows={prop.value.length > 80 ? 3 : 1}
                value={prop.value}
                onChange={(e) => updateProperty(i, { value: e.target.value })}
                placeholder="Value…"
              />
              <div className="mt-2 flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs text-stone-500">
                  Lang
                  <input
                    className="input !w-16 !px-1.5 !py-0.5"
                    value={prop.lang ?? ''}
                    onChange={(e) => updateProperty(i, { lang: e.target.value || undefined })}
                    placeholder="en"
                    maxLength={8}
                  />
                </label>
                <label className="flex items-center gap-1.5 text-xs text-stone-500">
                  <input
                    type="checkbox"
                    checked={prop.isIri ?? false}
                    onChange={(e) => updateProperty(i, { isIri: e.target.checked || undefined })}
                  />
                  Value is an IRI (link)
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex gap-2">
            <select className="input" value={newField} onChange={(e) => setNewField(e.target.value)}>
              <option value="">Add field from a vocabulary…</option>
              {vocabularies.map((v) => (
                <optgroup key={v.prefix} label={v.label}>
                  {v.properties.map((p) => (
                    <option key={p.term} value={`${v.prefix}:${p.term}`}>
                      {p.label} ({v.prefix}:{p.term})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button
              className="btn-secondary shrink-0"
              onClick={() => {
                addField(newField);
                setNewField('');
              }}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              value={customField}
              onChange={(e) => setCustomField(e.target.value)}
              placeholder="Custom term, e.g. crm:P3_has_note"
            />
            <button
              className="btn-secondary shrink-0"
              onClick={() => {
                addField(customField);
                setCustomField('');
              }}
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="card p-4">
        <h2 className="mb-3 font-serif text-lg font-semibold">Media</h2>
        <div className="space-y-2">
          {media.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input"
                value={m.url}
                onChange={(e) =>
                  setMedia((prev) => prev.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                }
                placeholder="Image URL"
              />
              <input
                className="input"
                value={m.caption ?? ''}
                onChange={(e) =>
                  setMedia((prev) =>
                    prev.map((x, j) => (j === i ? { ...x, caption: e.target.value || undefined } : x)),
                  )
                }
                placeholder="Caption (optional)"
              />
              <button
                onClick={() => setMedia((prev) => prev.filter((_, j) => j !== i))}
                className="btn-danger shrink-0"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button className="btn-secondary mt-3" onClick={() => setMedia((prev) => [...prev, { url: '' }])}>
          + Add image URL
        </button>
      </section>

      {/* Record settings */}
      <section className="card p-4">
        <h2 className="mb-3 font-serif text-lg font-semibold">Record</h2>
        <label className="label" htmlFor="item-iri">
          Canonical IRI (@id) — optional
        </label>
        <input
          id="item-iri"
          className="input"
          value={iri}
          onChange={(e) => setIri(e.target.value)}
          placeholder="https://example.org/id/artifact/SF-001"
        />
        <label className="mt-3 flex items-center gap-2 text-sm text-stone-700">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Feature this item on the home page
        </label>
      </section>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : item ? 'Save changes' : 'Create item'}
        </button>
        <button className="btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </div>
  );
}
