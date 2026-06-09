import { NextResponse } from 'next/server';
import type { ArtifactItem } from '@/lib/types';
import { deleteItem, getItem, saveItem } from '@/lib/store';

export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const item = getItem(params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: Params) {
  const existing = getItem(params.id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  let body: Partial<ArtifactItem>;
  try {
    body = (await request.json()) as Partial<ArtifactItem>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const item: ArtifactItem = {
    ...existing,
    iri: body.iri !== undefined ? body.iri || undefined : existing.iri,
    types: Array.isArray(body.types) ? body.types : existing.types,
    properties: Array.isArray(body.properties) ? body.properties : existing.properties,
    media: Array.isArray(body.media) ? body.media : existing.media,
    featured: body.featured !== undefined ? body.featured === true : existing.featured,
    updatedAt: new Date().toISOString(),
  };
  saveItem(item);
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!deleteItem(params.id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
