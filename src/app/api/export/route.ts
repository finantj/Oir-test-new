import { NextResponse } from 'next/server';
import { getAllVocabularies, listItems } from '@/lib/store';
import { itemsToGraph } from '@/lib/jsonld';

export const dynamic = 'force-dynamic';

export async function GET() {
  const doc = itemsToGraph(listItems(), getAllVocabularies());
  return new NextResponse(JSON.stringify(doc, null, 2), {
    headers: {
      'Content-Type': 'application/ld+json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="collection.jsonld"',
    },
  });
}
