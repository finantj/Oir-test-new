import { NextResponse } from 'next/server';
import { getAllVocabularies, getItem } from '@/lib/store';
import { itemToJsonLd } from '@/lib/jsonld';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const item = getItem(params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const doc = itemToJsonLd(item, getAllVocabularies());
  return new NextResponse(JSON.stringify(doc, null, 2), {
    headers: {
      'Content-Type': 'application/ld+json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${item.id}.jsonld"`,
    },
  });
}
