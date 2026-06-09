import type {
  ArtifactItem,
  ImportPreview,
  MediaRef,
  ParsedItem,
  PropertyValue,
  Vocabulary,
} from './types';
import { NAMESPACE_ALIASES, OIR_NS } from './vocabularies';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonObject = { [key: string]: JsonValue };

const MEDIA_TERMS = new Set(['schema:image', 'crm:P138i_has_representation', 'foaf:depiction']);
const LANG_TAG = /^[a-z]{2,3}(-[A-Za-z0-9]+)?$/;

function canonicalNamespace(ns: string): string {
  return NAMESPACE_ALIASES[ns] ?? ns;
}

/** Map of canonical namespace -> prefix for the known vocabularies. */
function prefixMap(vocabs: Vocabulary[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const v of vocabs) map.set(canonicalNamespace(v.namespace), v.prefix);
  map.set(OIR_NS, 'oir');
  return map;
}

/** Compact a full IRI against the known vocabularies; returns null if no namespace matches. */
function compactIri(iri: string, vocabs: Vocabulary[]): string | null {
  let best: { ns: string; prefix: string } | null = null;
  const entries = prefixMap(vocabs);
  const aliases = Object.keys(NAMESPACE_ALIASES);
  const candidates: Array<[string, string]> = [];
  entries.forEach((prefix, ns) => candidates.push([ns, prefix]));
  for (const alias of aliases) {
    const prefix = entries.get(NAMESPACE_ALIASES[alias]);
    if (prefix) candidates.push([alias, prefix]);
  }
  for (const [ns, prefix] of candidates) {
    if (iri.startsWith(ns) && iri.length > ns.length) {
      if (!best || ns.length > best.ns.length) best = { ns, prefix };
    }
  }
  if (!best) return null;
  return `${best.prefix}:${iri.slice(best.ns.length)}`;
}

interface DocContext {
  /** prefix or term -> IRI/namespace */
  mappings: Record<string, string>;
  vocab?: string;
}

function gatherContext(ctx: JsonValue | undefined, parent?: DocContext): DocContext {
  const result: DocContext = {
    mappings: { ...(parent?.mappings ?? {}) },
    vocab: parent?.vocab,
  };
  if (!ctx) return result;
  const entries = Array.isArray(ctx) ? ctx : [ctx];
  for (const entry of entries) {
    if (typeof entry === 'string') {
      // Remote context URL: treat well-known ones as a default vocabulary.
      const ns = canonicalNamespace(entry.replace(/\/?$/, '/'));
      if (ns === 'https://schema.org/') result.vocab = ns;
      continue;
    }
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) continue;
    for (const [key, value] of Object.entries(entry)) {
      if (key === '@vocab' && typeof value === 'string') {
        result.vocab = canonicalNamespace(value);
      } else if (typeof value === 'string') {
        result.mappings[key] = canonicalNamespace(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const id = (value as JsonObject)['@id'];
        if (typeof id === 'string') result.mappings[key] = canonicalNamespace(id);
      }
    }
  }
  return result;
}

/**
 * Resolve a JSON key or @type value to a prefixed term against the known
 * vocabularies. Returns the original key when it cannot be resolved.
 */
function compactKey(
  key: string,
  ctx: DocContext,
  vocabs: Vocabulary[],
  warnings: string[],
): string {
  // Full IRI
  if (/^https?:\/\//.test(key)) {
    const compacted = compactIri(key, vocabs);
    if (compacted) return compacted;
    warnings.push(`Unknown namespace for "${key}" — kept as full IRI.`);
    return key;
  }
  // Term defined directly in the document context
  const mapped = ctx.mappings[key];
  if (mapped && /^https?:\/\//.test(mapped) && !mapped.endsWith('/') && !mapped.endsWith('#')) {
    const compacted = compactIri(mapped, vocabs);
    if (compacted) return compacted;
  }
  // prefix:local
  const idx = key.indexOf(':');
  if (idx > 0) {
    const prefix = key.slice(0, idx);
    const local = key.slice(idx + 1);
    const ns = ctx.mappings[prefix];
    if (ns) {
      const compacted = compactIri(ns + local, vocabs);
      if (compacted) return compacted;
      warnings.push(`Namespace <${ns}> for prefix "${prefix}" is not a registered vocabulary — kept term "${key}".`);
      return key;
    }
    // Prefix matches a registered vocabulary even without a document context
    if (vocabs.some((v) => v.prefix === prefix) || prefix === 'dc') {
      return prefix === 'dc' ? `dcterms:${local}` : key;
    }
    return key;
  }
  // Bare term: resolve against @vocab if available
  if (ctx.vocab) {
    const compacted = compactIri(ctx.vocab + key, vocabs);
    if (compacted) return compacted;
  }
  return key;
}

function isLanguageMap(obj: JsonObject): boolean {
  const keys = Object.keys(obj);
  return (
    keys.length > 0 &&
    keys.every((k) => LANG_TAG.test(k) && typeof obj[k] === 'string')
  );
}

/** Flatten a nested node into a readable literal (used for embedded blank nodes). */
function flattenNode(obj: JsonObject): string {
  for (const key of ['name', 'schema:name', 'rdfs:label', 'label', 'title', 'dcterms:title']) {
    const v = obj[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  const parts: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('@')) continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      const s = String(value).trim().replace(/\s+/g, ' ');
      if (s) parts.push(s);
    }
  }
  if (parts.length > 0) return parts.join(' · ');
  const id = obj['@id'];
  return typeof id === 'string' ? id : JSON.stringify(obj);
}

function parseValue(term: string, raw: JsonValue, out: PropertyValue[]): void {
  if (raw === null || raw === undefined) return;
  if (Array.isArray(raw)) {
    for (const entry of raw) parseValue(term, entry, out);
    return;
  }
  if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
    const s = String(raw).trim();
    if (!s) return;
    if (/^https?:\/\/\S+$/.test(s)) out.push({ term, value: s, isIri: true });
    else out.push({ term, value: s });
    return;
  }
  const obj = raw as JsonObject;
  if ('@value' in obj) {
    const value = String(obj['@value'] ?? '').trim();
    if (!value) return;
    const lang = typeof obj['@language'] === 'string' ? obj['@language'] : undefined;
    out.push({ term, value, lang });
    return;
  }
  if ('@id' in obj && typeof obj['@id'] === 'string' && Object.keys(obj).length <= 2) {
    out.push({ term, value: obj['@id'], isIri: true });
    return;
  }
  if (isLanguageMap(obj)) {
    for (const [lang, value] of Object.entries(obj)) {
      out.push({ term, value: String(value), lang });
    }
    return;
  }
  out.push({ term, value: flattenNode(obj) });
}

function parseNode(
  node: JsonObject,
  ctx: DocContext,
  vocabs: Vocabulary[],
  warnings: string[],
): ParsedItem {
  const nodeCtx = gatherContext(node['@context'], ctx);
  const item: ParsedItem = { types: [], properties: [], media: [] };

  const id = node['@id'];
  if (typeof id === 'string') item.iri = id;

  const rawTypes = node['@type'];
  const typeList = Array.isArray(rawTypes) ? rawTypes : rawTypes ? [rawTypes] : [];
  for (const t of typeList) {
    if (typeof t === 'string') item.types.push(compactKey(t, nodeCtx, vocabs, warnings));
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('@')) continue;
    const term = compactKey(key, nodeCtx, vocabs, warnings);
    if (term === 'oir:recordCreated' || term === 'oir:recordModified' || term === 'oir:featured') {
      continue; // internal record keys handled by the store
    }
    if (MEDIA_TERMS.has(term)) {
      const rawList = Array.isArray(value) ? value : [value];
      for (const entry of rawList) {
        if (typeof entry === 'string' && entry.trim()) {
          item.media.push({ url: entry.trim() });
        } else if (typeof entry === 'object' && entry !== null && !Array.isArray(entry)) {
          const o = entry as JsonObject;
          const url = o['schema:contentUrl'] ?? o['contentUrl'] ?? o['@id'];
          if (typeof url === 'string') {
            const caption = o['schema:caption'] ?? o['caption'];
            item.media.push({
              url,
              caption: typeof caption === 'string' ? caption : undefined,
            });
          }
        }
      }
    } else {
      const values: PropertyValue[] = [];
      parseValue(term, value, values);
      item.properties.push(...values);
    }
  }
  return item;
}

/**
 * Parse a JSON-LD document (a single node, an array of nodes, or a document
 * with an @graph) into importable items.
 */
export function parseJsonLdDocument(doc: JsonValue, vocabs: Vocabulary[]): ImportPreview {
  const warnings: string[] = [];
  const items: ParsedItem[] = [];
  const visit = (value: JsonValue, ctx: DocContext) => {
    if (Array.isArray(value)) {
      for (const entry of value) visit(entry, ctx);
      return;
    }
    if (typeof value !== 'object' || value === null) return;
    const obj = value as JsonObject;
    const merged = gatherContext(obj['@context'], ctx);
    if (Array.isArray(obj['@graph'])) {
      for (const node of obj['@graph'] as JsonValue[]) visit(node, merged);
      return;
    }
    const hasData = Object.keys(obj).some((k) => !k.startsWith('@')) || '@type' in obj;
    if (hasData) items.push(parseNode(obj, merged, vocabs, warnings));
  };
  visit(doc, { mappings: {} });
  if (items.length === 0) warnings.push('No nodes with properties were found in the document.');
  return { items, warnings: Array.from(new Set(warnings)) };
}

export function parseJsonLdText(text: string, vocabs: Vocabulary[]): ImportPreview {
  let doc: JsonValue;
  try {
    doc = JSON.parse(text) as JsonValue;
  } catch (err) {
    return {
      items: [],
      warnings: [`The document is not valid JSON: ${err instanceof Error ? err.message : String(err)}`],
    };
  }
  return parseJsonLdDocument(doc, vocabs);
}

/* ------------------------------------------------------------------ */
/* Serialisation                                                       */
/* ------------------------------------------------------------------ */

function usedPrefixes(item: ArtifactItem): Set<string> {
  const prefixes = new Set<string>();
  const collect = (term: string) => {
    const idx = term.indexOf(':');
    if (idx > 0 && !/^https?$/.test(term.slice(0, idx))) prefixes.add(term.slice(0, idx));
  };
  item.types.forEach(collect);
  item.properties.forEach((p) => collect(p.term));
  return prefixes;
}

function buildContext(item: ArtifactItem, vocabs: Vocabulary[], includeOir: boolean): JsonObject {
  const ctx: JsonObject = {};
  const prefixes = usedPrefixes(item);
  if (item.media.length > 0) prefixes.add('schema');
  for (const prefix of Array.from(prefixes).sort()) {
    const vocab = vocabs.find((v) => v.prefix === prefix);
    if (vocab) ctx[prefix] = vocab.namespace;
  }
  if (includeOir) ctx['oir'] = OIR_NS;
  return ctx;
}

function serialiseValues(values: PropertyValue[]): JsonValue {
  const out: JsonValue[] = values.map((v): JsonValue => {
    if (v.isIri) return { '@id': v.value };
    if (v.lang) return { '@value': v.value, '@language': v.lang };
    return v.value;
  });
  return out.length === 1 ? out[0] : out;
}

export interface JsonLdOptions {
  /** Include oir:recordCreated / oir:recordModified bookkeeping keys. */
  includeRecordKeys?: boolean;
}

export function itemToJsonLdNode(
  item: ArtifactItem,
  vocabs: Vocabulary[],
  options: JsonLdOptions = {},
): JsonObject {
  const node: JsonObject = {};
  node['@id'] = item.iri || `${OIR_NS}artifact/${item.id}`;
  if (item.types.length > 0) node['@type'] = item.types.length === 1 ? item.types[0] : [...item.types];

  const grouped = new Map<string, PropertyValue[]>();
  for (const prop of item.properties) {
    if (!grouped.has(prop.term)) grouped.set(prop.term, []);
    grouped.get(prop.term)!.push(prop);
  }
  grouped.forEach((values, term) => {
    node[term] = serialiseValues(values);
  });

  if (item.media.length > 0) {
    node['schema:image'] = item.media.map((m): JsonValue =>
      m.caption
        ? { '@type': 'schema:ImageObject', 'schema:contentUrl': m.url, 'schema:caption': m.caption }
        : { '@id': m.url },
    );
  }
  if (options.includeRecordKeys) {
    node['oir:recordCreated'] = item.createdAt;
    node['oir:recordModified'] = item.updatedAt;
    if (item.featured) node['oir:featured'] = true;
  }
  return node;
}

export function itemToJsonLd(
  item: ArtifactItem,
  vocabs: Vocabulary[],
  options: JsonLdOptions = {},
): JsonObject {
  return {
    '@context': buildContext(item, vocabs, options.includeRecordKeys ?? false),
    ...itemToJsonLdNode(item, vocabs, options),
  };
}

export function itemsToGraph(items: ArtifactItem[], vocabs: Vocabulary[]): JsonObject {
  const ctx: JsonObject = {};
  for (const item of items) {
    Object.assign(ctx, buildContext(item, vocabs, false));
  }
  return {
    '@context': ctx,
    '@graph': items.map((item) => itemToJsonLdNode(item, vocabs)),
  };
}
