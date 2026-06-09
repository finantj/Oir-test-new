'use client';

import { useMemo, useState } from 'react';
import type { ArtifactItem } from '@/lib/types';
import {
  collectFacets,
  itemContext,
  itemMaterial,
  itemObjectType,
  itemPeriod,
} from '@/lib/itemUtils';
import ItemCard from './ItemCard';

export default function BrowseGallery({ items }: { items: ArtifactItem[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [material, setMaterial] = useState('');
  const [context, setContext] = useState('');
  const [period, setPeriod] = useState('');

  const facets = useMemo(() => collectFacets(items), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (type && itemObjectType(item) !== type) return false;
      if (material && itemMaterial(item) !== material) return false;
      if (context && itemContext(item) !== context) return false;
      if (period && itemPeriod(item) !== period) return false;
      if (q) {
        const haystack = [
          item.id,
          ...item.types,
          ...item.properties.map((p) => p.value),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, query, type, material, context, period]);

  const facetSelect = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    options: string[],
  ) =>
    options.length > 0 && (
      <div>
        <label className="label">{label}</label>
        <select className="input" value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="">All</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px,1fr]">
      <aside className="card h-fit space-y-4 p-4">
        <div>
          <label className="label">Search</label>
          <input
            className="input"
            placeholder="Search all metadata…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {facetSelect('Object type', type, setType, facets.types)}
        {facetSelect('Material', material, setMaterial, facets.materials)}
        {facetSelect('Context / findspot', context, setContext, facets.contexts)}
        {facetSelect('Period', period, setPeriod, facets.periods)}
        {(query || type || material || context || period) && (
          <button
            className="btn-secondary w-full justify-center"
            onClick={() => {
              setQuery('');
              setType('');
              setMaterial('');
              setContext('');
              setPeriod('');
            }}
          >
            Clear filters
          </button>
        )}
      </aside>
      <div>
        <p className="mb-3 text-sm text-stone-500">
          {filtered.length} of {items.length} artifacts
        </p>
        {filtered.length === 0 ? (
          <div className="card p-8 text-center text-sm text-stone-500">
            No artifacts match the current filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
