import { NextResponse } from 'next/server';
import { deleteExhibit, getExhibit } from '@/lib/store';

export const dynamic = 'force-dynamic';

interface Params {
  params: { slug: string };
}

export async function GET(_request: Request, { params }: Params) {
  const exhibit = getExhibit(params.slug);
  if (!exhibit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(exhibit);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!deleteExhibit(params.slug)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
