import { NextResponse } from 'next/server';
import type { ArtifactItem } from '@/lib/types';
import { listItems, saveItem, uniqueItemId } from '@/lib/store';
import { firstValue } from '@/lib/itemUtils';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(listItems());
}

export async function POST(request: Request) {
  let body: Partial<ArtifactItem>;
  try {
    body = (await request.json()) as Partial<ArtifactItem>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const properties = Array.isArray(body.properties) ? body.properties : [];
  const title =
    firstValue({ properties }, ['dcterms:title', 'schema:name']) ?? body.id ?? 'item';
  const now = new Date().toISOString();
  const item: ArtifactItem = {
    id: uniqueItemId(body.id || title),
    iri: body.iri || undefined,
    types: Array.isArray(body.types) ? body.types : [],
    properties,
    media: Array.isArray(body.media) ? body.media : [],
    featured: body.featured === true,
    createdAt: now,
    updatedAt: now,
  };
  saveItem(item);
  return NextResponse.json(item, { status: 201 });
}
