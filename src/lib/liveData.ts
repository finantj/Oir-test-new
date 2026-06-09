import { unstable_noStore } from 'next/cache';

export const isStaticBuild = process.env.NEXT_PUBLIC_OIR_STATIC === '1';

/**
 * In the server build, opt the calling page out of static caching so it always
 * reflects the current contents of the data directory. In a static export the
 * pages are rendered once at build time, so this is a no-op.
 */
export function liveData(): void {
  if (!isStaticBuild) unstable_noStore();
}

/** Href for a single item's JSON-LD download in the current build mode. */
export function itemJsonLdHref(id: string): string {
  return isStaticBuild ? `/downloads/${id}.jsonld` : `/api/items/${id}/jsonld`;
}

/** Href for the whole-collection JSON-LD download in the current build mode. */
export function collectionJsonLdHref(): string {
  return isStaticBuild ? '/downloads/collection.jsonld' : '/api/export';
}
