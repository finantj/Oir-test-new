import { NextResponse } from 'next/server';
import type { TermDef, Vocabulary } from '@/lib/types';
import { deleteCustomVocabulary, getAllVocabularies, saveCustomVocabulary } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getAllVocabularies());
}

function cleanTerms(raw: unknown): TermDef[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is TermDef => typeof t === 'object' && t !== null && typeof (t as TermDef).term === 'string')
    .map((t) => ({ term: t.term.trim(), label: (t.label || t.term).trim(), comment: t.comment }))
    .filter((t) => t.term.length > 0);
}

export async function POST(request: Request) {
  let body: Partial<Vocabulary>;
  try {
    body = (await request.json()) as Partial<Vocabulary>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const prefix = (body.prefix ?? '').trim();
  const namespace = (body.namespace ?? '').trim();
  if (!/^[a-z][a-z0-9_-]*$/i.test(prefix)) {
    return NextResponse.json({ error: 'Prefix must be alphanumeric, e.g. "edm".' }, { status: 400 });
  }
  if (!/^https?:\/\/.+[/#]$/.test(namespace)) {
    return NextResponse.json(
      { error: 'Namespace must be an http(s) IRI ending in "/" or "#".' },
      { status: 400 },
    );
  }
  const vocab: Vocabulary = {
    prefix,
    namespace,
    label: (body.label ?? prefix).trim() || prefix,
    description: body.description?.trim() || undefined,
    classes: cleanTerms(body.classes),
    properties: cleanTerms(body.properties),
  };
  try {
    saveCustomVocabulary(vocab);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Save failed' }, { status: 400 });
  }
  return NextResponse.json(vocab, { status: 201 });
}

export async function DELETE(request: Request) {
  const prefix = new URL(request.url).searchParams.get('prefix');
  if (!prefix) return NextResponse.json({ error: 'Missing prefix' }, { status: 400 });
  deleteCustomVocabulary(prefix);
  return NextResponse.json({ ok: true });
}
