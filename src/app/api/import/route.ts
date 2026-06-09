import { NextResponse } from 'next/server';
import type { ParsedItem } from '@/lib/types';
import { createItemFromParsed } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { items?: ParsedItem[] };
  try {
    body = (await request.json()) as { items?: ParsedItem[] };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'No items to import' }, { status: 400 });
  }
  const created = body.items.map((parsed) =>
    createItemFromParsed({
      iri: parsed.iri,
      types: Array.isArray(parsed.types) ? parsed.types : [],
      properties: Array.isArray(parsed.properties) ? parsed.properties : [],
      media: Array.isArray(parsed.media) ? parsed.media : [],
    }),
  );
  return NextResponse.json({ created: created.map((i) => i.id) }, { status: 201 });
}
