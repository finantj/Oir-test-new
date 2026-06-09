'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TermDef, Vocabulary } from '@/lib/types';

function parseTermLines(text: string): TermDef[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [term, label, comment] = line.split('|').map((s) => s.trim());
      return { term, label: label || term, comment: comment || undefined };
    })
    .filter((t) => t.term.length > 0);
}

export default function VocabManager({ vocabularies }: { vocabularies: Vocabulary[] }) {
  const router = useRouter();
  const [prefix, setPrefix] = useState('');
  const [namespace, setNamespace] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [propertiesText, setPropertiesText] = useState('');
  const [classesText, setClassesText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setError(null);
    setSaving(true);
    const res = await fetch('/api/vocabularies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prefix,
        namespace,
        label,
        description,
        properties: parseTermLines(propertiesText),
        classes: parseTermLines(classesText),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? `Save failed (${res.status})`);
      return;
    }
    setPrefix('');
    setNamespace('');
    setLabel('');
    setDescription('');
    setPropertiesText('');
    setClassesText('');
    router.refresh();
  };

  const remove = async (vocabPrefix: string) => {
    if (!window.confirm(`Remove vocabulary "${vocabPrefix}"?`)) return;
    await fetch(`/api/vocabularies?prefix=${encodeURIComponent(vocabPrefix)}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        {vocabularies.map((v) => (
          <details key={v.prefix} className="card overflow-hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3">
              <span>
                <span className="font-serif text-base font-semibold text-stone-900">{v.label}</span>
                <span className="ml-2 font-mono text-xs text-stone-400">
                  {v.prefix}: &lt;{v.namespace}&gt;
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className={`badge ${v.builtin ? 'bg-stone-200 text-stone-600' : 'bg-emerald-50 text-emerald-900'}`}>
                  {v.builtin ? 'built-in' : 'custom'}
                </span>
                {!v.builtin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      remove(v.prefix);
                    }}
                    className="btn-danger !px-2 !py-0.5 text-xs"
                  >
                    Remove
                  </button>
                )}
              </span>
            </summary>
            <div className="border-t border-stone-200 px-4 py-3 text-sm">
              {v.description && <p className="mb-3 text-stone-600">{v.description}</p>}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="label">Properties ({v.properties.length})</p>
                  <ul className="max-h-56 space-y-0.5 overflow-y-auto text-xs text-stone-600">
                    {v.properties.map((p) => (
                      <li key={p.term}>
                        <span className="font-medium text-stone-800">{p.label}</span>{' '}
                        <span className="font-mono text-stone-400">
                          {v.prefix}:{p.term}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label">Classes ({v.classes.length})</p>
                  <ul className="max-h-56 space-y-0.5 overflow-y-auto text-xs text-stone-600">
                    {v.classes.map((c) => (
                      <li key={c.term}>
                        <span className="font-medium text-stone-800">{c.label}</span>{' '}
                        <span className="font-mono text-stone-400">
                          {v.prefix}:{c.term}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </details>
        ))}
      </section>

      <section className="card p-4">
        <h2 className="mb-1 font-serif text-lg font-semibold">Add a vocabulary</h2>
        <p className="mb-4 text-sm text-stone-500">
          Register any RDF vocabulary (e.g. EDM, SKOS, GeoNames) by prefix and namespace. Its terms
          become available in the item editor and the JSON-LD importer.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Prefix</label>
            <input className="input" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="edm" />
          </div>
          <div>
            <label className="label">Namespace IRI (ends in / or #)</label>
            <input
              className="input"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              placeholder="http://www.europeana.eu/schemas/edm/"
            />
          </div>
          <div>
            <label className="label">Label</label>
            <input
              className="input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Europeana Data Model"
            />
          </div>
          <div>
            <label className="label">Description (optional)</label>
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Properties — one per line: term | label | comment</label>
            <textarea
              className="input min-h-[120px] font-mono text-xs"
              value={propertiesText}
              onChange={(e) => setPropertiesText(e.target.value)}
              placeholder={'isShownBy | Is Shown By\nhasMet | Has Met'}
            />
          </div>
          <div>
            <label className="label">Classes — one per line: term | label</label>
            <textarea
              className="input min-h-[120px] font-mono text-xs"
              value={classesText}
              onChange={(e) => setClassesText(e.target.value)}
              placeholder={'ProvidedCHO | Provided Cultural Heritage Object'}
            />
          </div>
        </div>
        {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button className="btn-primary mt-4" onClick={submit} disabled={saving || !prefix || !namespace}>
          {saving ? 'Saving…' : 'Add vocabulary'}
        </button>
      </section>
    </div>
  );
}
