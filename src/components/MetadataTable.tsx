import type { ArtifactItem, Vocabulary } from '@/lib/types';
import { termLabel } from '@/lib/vocabularies';

interface Group {
  key: string;
  label: string;
  rows: { term: string; label: string; values: ArtifactItem['properties'] }[];
}

function groupProperties(item: ArtifactItem, vocabs: Vocabulary[]): Group[] {
  const groups = new Map<string, Group>();
  for (const prop of item.properties) {
    const idx = prop.term.indexOf(':');
    const prefix = idx > 0 ? prop.term.slice(0, idx) : '';
    const vocab = vocabs.find((v) => v.prefix === prefix);
    const key = vocab ? vocab.prefix : prefix || 'other';
    const label = vocab ? vocab.label : prefix ? `${prefix}:` : 'Other';
    if (!groups.has(key)) groups.set(key, { key, label, rows: [] });
    const group = groups.get(key)!;
    let row = group.rows.find((r) => r.term === prop.term);
    if (!row) {
      row = { term: prop.term, label: termLabel(vocabs, prop.term), values: [] };
      group.rows.push(row);
    }
    row.values.push(prop);
  }
  return Array.from(groups.values());
}

export default function MetadataTable({
  item,
  vocabularies,
}: {
  item: ArtifactItem;
  vocabularies: Vocabulary[];
}) {
  const groups = groupProperties(item, vocabularies);
  if (groups.length === 0) {
    return <p className="text-sm text-stone-500">This item has no metadata yet.</p>;
  }
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.key}>
          <h3 className="mb-2 border-b border-stone-200 pb-1 text-sm font-semibold uppercase tracking-wide text-emerald-900">
            {group.label}
          </h3>
          <dl className="divide-y divide-stone-100">
            {group.rows.map((row) => (
              <div key={row.term} className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-[200px,1fr] sm:gap-4">
                <dt>
                  <span className="text-sm font-medium text-stone-700">{row.label}</span>
                  <span className="block font-mono text-[11px] text-stone-400">{row.term}</span>
                </dt>
                <dd className="space-y-1 text-sm text-stone-900">
                  {row.values.map((v, i) => (
                    <div key={i}>
                      {v.isIri ? (
                        <a
                          href={v.value}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-emerald-800 underline decoration-emerald-300 underline-offset-2"
                        >
                          {v.value}
                        </a>
                      ) : (
                        <span className="whitespace-pre-wrap">{v.value}</span>
                      )}
                      {v.lang && (
                        <span className="ml-1.5 rounded bg-stone-100 px-1 font-mono text-[10px] uppercase text-stone-500">
                          {v.lang}
                        </span>
                      )}
                    </div>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
