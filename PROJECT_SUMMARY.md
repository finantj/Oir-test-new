# Oir Artifact Repository — Project Summary

**Repository:** `finantj/Oir-test-new` · **Branch:** `claude/artifact-repository-website-uzpnwz`
**Stack:** Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · no database
**Status:** Built, tested (production build, lint, full API round trips, static export), and pushed.

---

## 1. What this project is

The Oir Artifact Repository is an **Omeka-style repository and presentation website for
archaeological artifacts whose records are JSON-LD documents**, built for publishing the
finds from a single excavation. Like Omeka, it has two faces:

- an **import/edit mode** (the admin area) for ingesting JSON-LD, cataloguing artifacts
  with fields drawn from multiple metadata vocabularies, and curating exhibits; and
- a **display/exhibit mode** (the public site) for browsing, searching, and reading
  narrative exhibitions built from the catalogue.

Its defining design decision is that **the repository literally is a folder of JSON-LD
files**. There is no database. Each artifact is one `.jsonld` file on disk; the
application parses those files on demand, and everything else — search facets, item
pages, exhibits, exports — is derived from them. This makes the whole collection
portable, human-readable, versionable in git, and usable by any standard linked-data
tooling without going through the application at all.

## 2. Metadata model and vocabularies

Artifacts are described with properties from multiple RDF vocabularies, in the spirit of
Omeka's "element sets." Three vocabularies are built in:

| Prefix | Vocabulary | Namespace | Role |
|---|---|---|---|
| `dcterms` | Dublin Core Terms | `http://purl.org/dc/terms/` | General descriptive metadata (title, identifier, medium, spatial/temporal coverage, provenance, …) |
| `crm` | CIDOC CRM | `http://www.cidoc-crm.org/cidoc-crm/` | Event-centric cultural-heritage ontology (E22 Human-Made Object, P45 consists of, P53 has former or current location, …) |
| `schema` | Schema.org | `https://schema.org/` | Web/media metadata (image, material, keywords, …) |

Additional vocabularies (EDM, SKOS, GeoNames, project-specific ontologies, …) can be
registered at runtime through the admin UI by giving a **prefix, namespace IRI, label,
and lists of properties and classes**. Registered terms immediately appear in the item
editor's field pickers and are recognised by the importer. Custom vocabularies are stored
in `data/vocabularies.json`; built-ins are defined in `src/lib/vocabularies.ts`.

Each metadata value supports:
- **repeated fields** (e.g. two `dcterms:title` values),
- **language-tagged literals** (`@language`, e.g. Irish `ga` alongside English `en`),
- **IRI values** (`@id` references, rendered as links), and
- **classes** (`@type`) drawn from any registered vocabulary.

## 3. The JSON-LD layer

A small, dependency-free JSON-LD compactor/serialiser lives in `src/lib/jsonld.ts`.
It intentionally covers the common patterns of real-world descriptive JSON-LD rather
than the full JSON-LD 1.1 algorithm suite:

**Parsing (import path).** Accepts a single node, an array of nodes, or a document with
`@graph` (including nested `@context`s). Keys are resolved to prefixed terms against the
registered vocabularies, handling:
- full-IRI keys (`http://purl.org/dc/elements/1.1/creator` → `dcterms:creator`),
- document-local prefix definitions and `@vocab`,
- well-known remote contexts treated as a default vocabulary (`"@context": "https://schema.org"`),
- namespace aliasing (`dc:` elements → `dcterms`, `http://schema.org/` → `https://schema.org/`),
- value forms: plain literals, `{"@value", "@language"}`, `{"@id"}`, arrays, language
  maps (`{"ga": "…", "en": "…"}`), and embedded blank nodes (flattened to a readable
  label, e.g. a nested `Person` becomes "Cearbhall · O Dalaigh"),
- media terms (`schema:image`, `crm:P138i_has_representation`, `foaf:depiction`)
  captured as item media rather than ordinary properties.

Unresolvable terms are kept as-is and surfaced as **import warnings** rather than being
dropped, so nothing is silently lost.

**Serialising (export path).** Every item can be emitted as a standalone JSON-LD
document with a minimal `@context` containing exactly the prefixes it uses; the whole
catalogue can be emitted as a single `@graph`. Record bookkeeping (created/modified
timestamps, featured flag) is written under a project namespace (`oir:recordCreated`
etc.) so stored files remain valid JSON-LD, and these keys are stripped from display
metadata and public exports.

## 4. Storage layout

```
data/
├── items/               one JSON-LD file per artifact  (e.g. rg24-sf-001.jsonld)
├── exhibits.json        exhibit definitions (slug, title, summary, sections)
└── vocabularies.json    custom (non-built-in) vocabularies
```

- Item IDs are slugs derived from the identifier or title (with uniqueness enforcement).
- The store (`src/lib/store.ts`) re-parses files on every read, so files edited by hand
  or committed via git are picked up without any sync step.
- `OIR_DATA_DIR` relocates the data directory outside the project if desired.

## 5. Display / exhibit mode (public site)

| Route | Purpose |
|---|---|
| `/` | Hero/overview, collection statistics, featured finds |
| `/browse` | Card gallery with **full-text search** across all metadata plus **facets** for object type, material, context/findspot, and period (derived from `dcterms`/`crm` terms with fallbacks) |
| `/items/<id>` | Item page: media (or a placeholder), classes, **metadata grouped by vocabulary** with term labels and machine terms, IRI values as links, language tags shown, an expandable raw JSON-LD view, and a per-item `.jsonld` download |
| `/exhibits`, `/exhibits/<slug>` | Omeka-style narrative exhibits: ordered sections of heading + prose + attached artifact cards |
| `/api/export` (server) or `/downloads/collection.jsonld` (static) | Whole catalogue as one JSON-LD graph |

Search and facet filtering run **in the browser** (the gallery is a hydrated client
component fed baked-in data), which is what allows them to keep working on the static
export.

## 6. Import / edit mode (admin area, `/admin`)

- **Dashboard** — counts and shortcuts.
- **Items** — sortable table (identifier, title, type, field count, updated date) with
  edit/delete; editor supports class assignment from vocabulary pickers, add-field
  dropdowns grouped by vocabulary, free-form custom terms, repeated fields, language
  tags, IRI toggle, image URLs with captions, canonical `@id`, and a featured flag.
- **Import JSON-LD** — paste a document or upload multiple `.jsonld`/`.json` files;
  client-side parsing produces a **preview table** (title, classes, field/media counts)
  with per-item checkboxes and warnings; confirmed items are saved as individual files.
- **Exhibits** — create/edit exhibits as sections (heading, narrative, checkbox list of
  artifacts); slugs auto-derived.
- **Vocabularies** — inspect built-ins, register/remove custom vocabularies.

The admin area has **no authentication**; it is intended for local use (see §8) or
behind a reverse-proxy login.

## 7. HTTP API (server mode)

| Endpoint | Methods | Purpose |
|---|---|---|
| `/api/items` | GET, POST | List / create items |
| `/api/items/[id]` | GET, PUT, DELETE | Read / update / delete an item |
| `/api/items/[id]/jsonld` | GET | Download one item as `application/ld+json` |
| `/api/import` | POST | Persist parsed items from the importer |
| `/api/export` | GET | Whole collection as a JSON-LD `@graph` |
| `/api/vocabularies` | GET, POST, DELETE | List / register / remove vocabularies |
| `/api/exhibits`, `/api/exhibits/[slug]` | GET, POST, DELETE | Manage exhibits |

## 8. Two deployment modes

### Server mode (live editing)
`npm run build && npm start` runs a self-contained Node server (Next `standalone`
output) with the full admin and API. Public pages render per-request
(`unstable_noStore`), so edits appear immediately. Suitable for a VM, Docker, or any
Node host — **not** for classic PHP/cPanel shared hosting, and not for serverless hosts
with ephemeral filesystems (edits would not persist).

### Static export mode (plain shared hosting — e.g. Reclaim Hosting)
`npm run build:static` (`scripts/build-static.mjs`) produces a **fully static site** in
`out/` that any ordinary Apache/cPanel web space can serve:

1. The admin and API route sources are temporarily set aside; the public site is built
   with Next's `output: 'export'` (`OIR_STATIC=1`, trailing slashes for
   `folder/index.html` URLs).
2. Every item and exhibit page is pre-rendered (`generateStaticParams`); browse
   search/facets still work because they run client-side.
3. JSON-LD downloads are generated into `out/downloads/` — one cleaned file per item
   (bookkeeping keys stripped) plus a merged `collection.jsonld`.
4. An `.htaccess` is emitted (`AddType application/ld+json .jsonld`,
   `ErrorDocument 404`).

**Publishing workflow:** edit locally with `npm run dev` → `npm run build:static` →
upload the contents of `out/` to `public_html/`. The admin link is hidden and download
links point at `/downloads/` automatically in this mode (`src/lib/liveData.ts` switches
behaviour via `NEXT_PUBLIC_OIR_STATIC`).

## 9. Sample dataset

Because the repo's `excavation.txt` was an empty placeholder, the site ships with a
clearly-labelled demonstration dataset: **eight small finds from "Ráth Glas" ringfort**
(fictional licence 24E0107), each described with parallel Dublin Core and CIDOC CRM
metadata — a ringed pin, glass bead, composite comb fragment, whittle-tang knife,
souterrain ware sherd, rotary quern fragment, pendant whetstone, and a zoomorphic
strap-end — plus one exhibit, *Dress & Ornament at Ráth Glas* (three narrative
sections). Delete the files under `data/` to start fresh with real excavation records.

## 10. Code map

```
src/lib/
  types.ts          Core types: ArtifactItem, PropertyValue, Vocabulary, Exhibit, …
  vocabularies.ts   Built-in DC/CRM/Schema.org term definitions, aliases, labels
  jsonld.ts         Parser + serialiser (compaction, language maps, graphs)
  store.ts          File-based persistence (items, exhibits, vocabularies)
  itemUtils.ts      Title/identifier/facet helpers shared client & server
  liveData.ts       Server-vs-static mode switches (noStore, download hrefs)
src/app/            Public pages, /admin pages, /api route handlers
src/components/     ItemCard, ItemThumb, MetadataTable, BrowseGallery,
                    ItemEditor, ImportTool, VocabManager, ExhibitEditor,
                    AdminItemsTable, AdminExhibitsTable
scripts/build-static.mjs   Static exporter (see §8)
data/               The collection itself (see §4)
```

## 11. Verification performed

- Production build and ESLint clean in both modes.
- All public, admin, and API routes return 200 on a running server.
- Full API round trips: create → stored file inspected → edit → delete; import;
  exhibit create/delete; vocabulary register/remove.
- Round-trip fidelity: multi-valued titles, an Irish (`ga`) language-tagged literal,
  and captioned media all survive save → file → re-parse.
- Parser exercised against schema.org `@graph` documents with bare terms, nested
  `Person` nodes, `dc:` aliasing, and full-IRI keys.
- Static export served from a plain file server (no Node): every page, exhibit, and
  download verified; admin correctly absent.

## 12. Known limitations & sensible next steps

- **No authentication** on the admin area (moot for the static-publish workflow; needed
  before exposing server mode publicly).
- **Lightweight JSON-LD processing** — remote `@context` URLs are not fetched;
  documents that depend on them import with terms kept as-is and warnings shown.
- **Media are referenced by URL**, not uploaded/managed files; no image derivatives.
- Possible enhancements: file/image upload with local storage, per-item static pages for
  SEO metadata (schema.org embedding is partially there via exports), CSV import,
  authority-list value suggestions (Getty AAT, PeriodO), a map view from `dcterms:spatial`
  coordinates, and authentication for hosted editing.
