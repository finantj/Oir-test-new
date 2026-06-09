import fs from 'fs';
import path from 'path';
import type { ArtifactItem, Exhibit, ParsedItem, Vocabulary } from './types';
import { BUILTIN_VOCABULARIES } from './vocabularies';
import { itemToJsonLd, parseJsonLdDocument } from './jsonld';

const DATA_DIR = process.env.OIR_DATA_DIR ?? path.join(process.cwd(), 'data');
const ITEMS_DIR = path.join(DATA_DIR, 'items');
const VOCABS_FILE = path.join(DATA_DIR, 'vocabularies.json');
const EXHIBITS_FILE = path.join(DATA_DIR, 'exhibits.json');

function ensureDirs(): void {
  fs.mkdirSync(ITEMS_DIR, { recursive: true });
}

function readJsonFile<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* Vocabularies                                                        */
/* ------------------------------------------------------------------ */

export function getCustomVocabularies(): Vocabulary[] {
  return readJsonFile<Vocabulary[]>(VOCABS_FILE, []).map((v) => ({ ...v, builtin: false }));
}

export function getAllVocabularies(): Vocabulary[] {
  return [...BUILTIN_VOCABULARIES, ...getCustomVocabularies()];
}

export function saveCustomVocabulary(vocab: Vocabulary): void {
  ensureDirs();
  const all = getAllVocabularies();
  if (BUILTIN_VOCABULARIES.some((v) => v.prefix === vocab.prefix)) {
    throw new Error(`Prefix "${vocab.prefix}" is reserved by a built-in vocabulary.`);
  }
  const custom = getCustomVocabularies().filter((v) => v.prefix !== vocab.prefix);
  if (all.some((v) => v.prefix !== vocab.prefix && v.namespace === vocab.namespace)) {
    throw new Error(`Namespace <${vocab.namespace}> is already registered.`);
  }
  custom.push({ ...vocab, builtin: false });
  fs.writeFileSync(VOCABS_FILE, JSON.stringify(custom, null, 2));
}

export function deleteCustomVocabulary(prefix: string): void {
  const custom = getCustomVocabularies().filter((v) => v.prefix !== prefix);
  fs.writeFileSync(VOCABS_FILE, JSON.stringify(custom, null, 2));
}

/* ------------------------------------------------------------------ */
/* Items                                                               */
/* ------------------------------------------------------------------ */

interface StoredRecordKeys {
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
}

function extractRecordKeys(doc: unknown): StoredRecordKeys {
  if (typeof doc !== 'object' || doc === null) return {};
  const obj = doc as Record<string, unknown>;
  return {
    createdAt: typeof obj['oir:recordCreated'] === 'string' ? (obj['oir:recordCreated'] as string) : undefined,
    updatedAt: typeof obj['oir:recordModified'] === 'string' ? (obj['oir:recordModified'] as string) : undefined,
    featured: obj['oir:featured'] === true,
  };
}

function readItemFile(id: string, file: string, vocabs: Vocabulary[]): ArtifactItem | null {
  let doc: unknown;
  try {
    doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
  const preview = parseJsonLdDocument(doc as never, vocabs);
  const parsed = preview.items[0];
  if (!parsed) return null;
  const keys = extractRecordKeys(doc);
  const stat = fs.statSync(file);
  return {
    id,
    iri: parsed.iri,
    types: parsed.types,
    properties: parsed.properties,
    media: parsed.media,
    featured: keys.featured,
    createdAt: keys.createdAt ?? stat.birthtime.toISOString(),
    updatedAt: keys.updatedAt ?? stat.mtime.toISOString(),
  };
}

export function listItems(): ArtifactItem[] {
  ensureDirs();
  const vocabs = getAllVocabularies();
  const items: ArtifactItem[] = [];
  for (const entry of fs.readdirSync(ITEMS_DIR)) {
    if (!entry.endsWith('.jsonld')) continue;
    const id = entry.replace(/\.jsonld$/, '');
    const item = readItemFile(id, path.join(ITEMS_DIR, entry), vocabs);
    if (item) items.push(item);
  }
  items.sort((a, b) => a.id.localeCompare(b.id));
  return items;
}

export function getItem(id: string): ArtifactItem | null {
  ensureDirs();
  const file = path.join(ITEMS_DIR, `${path.basename(id)}.jsonld`);
  if (!fs.existsSync(file)) return null;
  return readItemFile(path.basename(id), file, getAllVocabularies());
}

export function saveItem(item: ArtifactItem): ArtifactItem {
  ensureDirs();
  const vocabs = getAllVocabularies();
  const doc = itemToJsonLd(item, vocabs, { includeRecordKeys: true });
  const file = path.join(ITEMS_DIR, `${path.basename(item.id)}.jsonld`);
  fs.writeFileSync(file, JSON.stringify(doc, null, 2));
  return item;
}

export function deleteItem(id: string): boolean {
  const file = path.join(ITEMS_DIR, `${path.basename(id)}.jsonld`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'item'
  );
}

export function uniqueItemId(preferred: string): string {
  ensureDirs();
  const base = slugify(preferred);
  let id = base;
  let counter = 2;
  while (fs.existsSync(path.join(ITEMS_DIR, `${id}.jsonld`))) {
    id = `${base}-${counter}`;
    counter += 1;
  }
  return id;
}

/** Create and persist a new item from parsed import data. */
export function createItemFromParsed(parsed: ParsedItem): ArtifactItem {
  const identifier = parsed.properties.find(
    (p) => p.term === 'dcterms:identifier' || p.term === 'crm:P1_is_identified_by',
  )?.value;
  const title = parsed.properties.find(
    (p) => p.term === 'dcterms:title' || p.term === 'schema:name' || p.term === 'crm:P102_has_title',
  )?.value;
  const now = new Date().toISOString();
  const item: ArtifactItem = {
    id: uniqueItemId(identifier || title || 'item'),
    iri: parsed.iri,
    types: parsed.types,
    properties: parsed.properties,
    media: parsed.media,
    createdAt: now,
    updatedAt: now,
  };
  return saveItem(item);
}

/* ------------------------------------------------------------------ */
/* Exhibits                                                            */
/* ------------------------------------------------------------------ */

export function listExhibits(): Exhibit[] {
  return readJsonFile<Exhibit[]>(EXHIBITS_FILE, []);
}

export function getExhibit(slug: string): Exhibit | null {
  return listExhibits().find((e) => e.slug === slug) ?? null;
}

export function saveExhibit(exhibit: Exhibit): void {
  ensureDirs();
  const exhibits = listExhibits().filter((e) => e.slug !== exhibit.slug);
  exhibits.push(exhibit);
  exhibits.sort((a, b) => a.title.localeCompare(b.title));
  fs.writeFileSync(EXHIBITS_FILE, JSON.stringify(exhibits, null, 2));
}

export function deleteExhibit(slug: string): boolean {
  const exhibits = listExhibits();
  const next = exhibits.filter((e) => e.slug !== slug);
  if (next.length === exhibits.length) return false;
  fs.writeFileSync(EXHIBITS_FILE, JSON.stringify(next, null, 2));
  return true;
}
