import { NextResponse } from 'next/server';
import type { Exhibit, ExhibitBlock } from '@/lib/types';
import { getExhibit, listExhibits, saveExhibit } from '@/lib/store';
import { slugify } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(listExhibits());
}

function cleanBlocks(raw: unknown): ExhibitBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((b): b is ExhibitBlock => typeof b === 'object' && b !== null)
    .map((b) => ({
      heading: typeof b.heading === 'string' ? b.heading : undefined,
      text: typeof b.text === 'string' ? b.text : undefined,
      itemIds: Array.isArray(b.itemIds) ? b.itemIds.filter((i): i is string => typeof i === 'string') : [],
    }));
}

export async function POST(request: Request) {
  let body: Partial<Exhibit>;
  try {
    body = (await request.json()) as Partial<Exhibit>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const title = (body.title ?? '').trim();
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  const slug = slugify(body.slug || title);
  const existing = getExhibit(slug);
  const now = new Date().toISOString();
  const exhibit: Exhibit = {
    slug,
    title,
    summary: body.summary?.trim() || undefined,
    blocks: cleanBlocks(body.blocks),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  saveExhibit(exhibit);
  return NextResponse.json(exhibit, { status: existing ? 200 : 201 });
}
