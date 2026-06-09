# Oir Artifact Repository

An Omeka-style repository and exhibition site for archaeological artifacts described as
**JSON-LD**. Every artifact record is a JSON-LD file on disk; the site provides an
import/edit (admin) mode and a display/exhibit (public) mode on top of that folder of files.

## Features

### Display mode (public)
- **Home** — excavation overview, collection statistics, featured finds.
- **Browse** (`/browse`) — full-text search plus facets for object type, material,
  context/findspot, and period.
- **Item pages** (`/items/<id>`) — media, metadata grouped by vocabulary, the raw JSON-LD
  for the record, and a per-item JSON-LD download (`/api/items/<id>/jsonld`).
- **Exhibits** (`/exhibits`) — curated narratives built from sections of text and
  selected artifacts, in the spirit of Omeka exhibits.
- **Export** — the whole catalogue as one JSON-LD graph at `/api/export`.

### Admin mode (`/admin`)
- **Items** — create, edit, and delete artifact records with a field editor. Fields are
  drawn from the registered vocabularies (grouped pickers), and repeated fields,
  language-tagged literals (e.g. `ga` / `en`), and IRI-valued fields are all supported.
- **Import JSON-LD** — paste a document or upload `.jsonld`/`.json` files. Single nodes,
  arrays, and `@graph` documents are supported; keys are resolved against the registered
  vocabularies (including `dc:` → `dcterms` and `http://schema.org/` aliasing), previewed,
  and then saved as individual item files.
- **Exhibits** — build narrative exhibits from sections (heading, text, attached items).
- **Vocabularies** — Dublin Core Terms, CIDOC CRM, and Schema.org are built in. Any other
  RDF vocabulary (EDM, SKOS, …) can be registered by prefix + namespace with its own
  property and class lists, after which its terms appear in the editor and importer.

> **Note:** the admin area has no authentication. Put it behind a reverse-proxy login (or
> add auth) before exposing it publicly.

## Data layout

```
data/
├── items/            one JSON-LD file per artifact, e.g. rg24-sf-001.jsonld
├── exhibits.json     exhibit definitions
└── vocabularies.json custom (non-built-in) vocabularies
```

Item files are plain JSON-LD and can be edited or version-controlled directly; the app
re-parses them on every request. Record bookkeeping uses the `oir:` namespace
(`oir:recordCreated`, `oir:recordModified`, `oir:featured`), which standard JSON-LD
processors will treat as ordinary triples and which the app strips from display metadata.
Set `OIR_DATA_DIR` to store data outside the project directory.

The repository ships with a sample dataset: eight small finds from a demonstration
early-medieval ringfort excavation ("Ráth Glas", licence 24E0107 — sample data) and one
exhibit, *Dress & Ornament at Ráth Glas*. Delete the files under `data/` to start fresh.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) — and
   [http://localhost:3000/admin](http://localhost:3000/admin) for the admin area.

## Scripts

- `npm run dev` – start the development server.
- `npm run build` – build the production application.
- `npm run start` – run the built application.
- `npm run lint` – lint the codebase with ESLint.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS. No database — the JSON-LD files in
`data/` are the store. A small, dependency-free JSON-LD compactor/serialiser lives in
`src/lib/jsonld.ts`; vocabularies are defined in `src/lib/vocabularies.ts`.
