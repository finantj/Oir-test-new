'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ParsedItem, Vocabulary } from '@/lib/types';
import { parseJsonLdText } from '@/lib/jsonld';
import { firstValue } from '@/lib/itemUtils';

interface Props {
  vocabularies: Vocabulary[];
}

interface PreviewState {
  items: ParsedItem[];
  warnings: string[];
  selected: boolean[];
}

function previewTitle(item: ParsedItem): string {
  return (
    firstValue(item, ['dcterms:title', 'schema:name', 'crm:P102_has_title', 'crm:P1_is_identified_by']) ??
    item.iri ??
    '(untitled)'
  );
}

export default function ImportTool({ vocabularies }: Props) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runParse = (source: string) => {
    setError(null);
    setResult(null);
    const parsed = parseJsonLdText(source, vocabularies);
    setPreview({
      items: parsed.items,
      warnings: parsed.warnings,
      selected: parsed.items.map(() => true),
    });
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setResult(null);
    const allItems: ParsedItem[] = [];
    const allWarnings: string[] = [];
    for (const file of Array.from(files)) {
      const content = await file.text();
      const parsed = parseJsonLdText(content, vocabularies);
      allItems.push(...parsed.items);
      allWarnings.push(...parsed.warnings.map((w) => `${file.name}: ${w}`));
    }
    setPreview({
      items: allItems,
      warnings: allWarnings,
      selected: allItems.map(() => true),
    });
  };

  const doImport = async () => {
    if (!preview) return;
    const items = preview.items.filter((_, i) => preview.selected[i]);
    if (items.length === 0) {
      setError('Select at least one item to import.');
      return;
    }
    setImporting(true);
    setError(null);
    const res = await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    setImporting(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? `Import failed (${res.status})`);
      return;
    }
    const body = (await res.json()) as { created: string[] };
    setResult(`Imported ${body.created.length} item(s): ${body.created.join(', ')}`);
    setPreview(null);
    setText('');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <section className="card p-4">
        <h2 className="mb-3 font-serif text-lg font-semibold">1 · Provide JSON-LD</h2>
        <p className="mb-3 text-sm text-stone-500">
          Upload one or more <code>.jsonld</code>/<code>.json</code> files, or paste a document.
          Single nodes, arrays, and <code>@graph</code> documents are all supported; terms are
          matched against the registered vocabularies.
        </p>
        <input
          type="file"
          accept=".json,.jsonld,application/json,application/ld+json"
          multiple
          onChange={(e) => onFiles(e.target.files)}
          className="mb-3 block w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-800 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-700"
        />
        <textarea
          className="input min-h-[180px] font-mono text-xs"
          placeholder='{"@context": {"dcterms": "http://purl.org/dc/terms/"}, "@graph": [ … ]}'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="btn-primary mt-3"
          onClick={() => runParse(text)}
          disabled={text.trim().length === 0}
        >
          Parse pasted document
        </button>
      </section>

      {preview && (
        <section className="card p-4">
          <h2 className="mb-3 font-serif text-lg font-semibold">2 · Review &amp; import</h2>
          {preview.warnings.length > 0 && (
            <ul className="mb-3 space-y-1 rounded-md bg-amber-50 p-3 text-xs text-amber-900">
              {preview.warnings.map((w, i) => (
                <li key={i}>⚠ {w}</li>
              ))}
            </ul>
          )}
          {preview.items.length === 0 ? (
            <p className="text-sm text-stone-500">Nothing importable was found.</p>
          ) : (
            <>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                  <tr>
                    <th className="py-2 pr-2" />
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Classes</th>
                    <th className="py-2 pr-4">Fields</th>
                    <th className="py-2">Media</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {preview.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-2">
                        <input
                          type="checkbox"
                          checked={preview.selected[i]}
                          onChange={(e) =>
                            setPreview((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    selected: prev.selected.map((s, j) =>
                                      j === i ? e.target.checked : s,
                                    ),
                                  }
                                : prev,
                            )
                          }
                        />
                      </td>
                      <td className="py-2 pr-4 font-medium text-stone-900">{previewTitle(item)}</td>
                      <td className="py-2 pr-4 font-mono text-xs text-stone-500">
                        {item.types.join(', ') || '—'}
                      </td>
                      <td className="py-2 pr-4 text-stone-600">{item.properties.length}</td>
                      <td className="py-2 text-stone-600">{item.media.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-primary mt-4" onClick={doImport} disabled={importing}>
                {importing
                  ? 'Importing…'
                  : `Import ${preview.selected.filter(Boolean).length} item(s)`}
              </button>
            </>
          )}
        </section>
      )}

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {result && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{result}</p>}
    </div>
  );
}
