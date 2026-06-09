import type { Vocabulary } from './types';

/** Internal namespace used for record-keeping keys in stored JSON-LD files. */
export const OIR_NS = 'https://oir.gaelicireland.org/ns/';

export const DUBLIN_CORE: Vocabulary = {
  prefix: 'dcterms',
  namespace: 'http://purl.org/dc/terms/',
  label: 'Dublin Core Terms',
  description:
    'DCMI Metadata Terms: general-purpose descriptive metadata for resources of any kind.',
  builtin: true,
  classes: [
    { term: 'PhysicalObject', label: 'Physical Object' },
    { term: 'Collection', label: 'Collection' },
    { term: 'Image', label: 'Image' },
    { term: 'Text', label: 'Text' },
  ],
  properties: [
    { term: 'title', label: 'Title', comment: 'A name given to the resource.' },
    { term: 'description', label: 'Description', comment: 'An account of the resource.' },
    { term: 'identifier', label: 'Identifier', comment: 'An unambiguous reference, e.g. a find number.' },
    { term: 'creator', label: 'Creator', comment: 'Entity primarily responsible for making the resource.' },
    { term: 'contributor', label: 'Contributor' },
    { term: 'date', label: 'Date', comment: 'A point or period of time associated with the resource.' },
    { term: 'created', label: 'Date Created' },
    { term: 'type', label: 'Type', comment: 'The nature or genre of the resource.' },
    { term: 'format', label: 'Format', comment: 'File format, physical medium, or dimensions.' },
    { term: 'medium', label: 'Medium', comment: 'The material or physical carrier of the resource.' },
    { term: 'extent', label: 'Extent', comment: 'The size or duration of the resource.' },
    { term: 'subject', label: 'Subject', comment: 'A topic of the resource.' },
    { term: 'coverage', label: 'Coverage', comment: 'Spatial or temporal topic of the resource.' },
    { term: 'spatial', label: 'Spatial Coverage', comment: 'Spatial characteristics, e.g. findspot or context.' },
    { term: 'temporal', label: 'Temporal Coverage', comment: 'Temporal characteristics, e.g. period.' },
    { term: 'provenance', label: 'Provenance', comment: 'Statement of changes in ownership and custody.' },
    { term: 'source', label: 'Source', comment: 'A related resource from which this one is derived.' },
    { term: 'relation', label: 'Relation', comment: 'A related resource.' },
    { term: 'isPartOf', label: 'Is Part Of' },
    { term: 'references', label: 'References' },
    { term: 'language', label: 'Language' },
    { term: 'rights', label: 'Rights' },
    { term: 'publisher', label: 'Publisher' },
  ],
};

export const CIDOC_CRM: Vocabulary = {
  prefix: 'crm',
  namespace: 'http://www.cidoc-crm.org/cidoc-crm/',
  label: 'CIDOC CRM',
  description:
    'CIDOC Conceptual Reference Model: event-centric ontology for cultural heritage documentation.',
  builtin: true,
  classes: [
    { term: 'E22_Human-Made_Object', label: 'E22 Human-Made Object' },
    { term: 'E18_Physical_Thing', label: 'E18 Physical Thing' },
    { term: 'E25_Human-Made_Feature', label: 'E25 Human-Made Feature' },
    { term: 'E20_Biological_Object', label: 'E20 Biological Object' },
    { term: 'E53_Place', label: 'E53 Place' },
    { term: 'E52_Time-Span', label: 'E52 Time-Span' },
    { term: 'E12_Production', label: 'E12 Production' },
    { term: 'E5_Event', label: 'E5 Event' },
    { term: 'E57_Material', label: 'E57 Material' },
    { term: 'E55_Type', label: 'E55 Type' },
    { term: 'E78_Curated_Holding', label: 'E78 Curated Holding' },
  ],
  properties: [
    { term: 'P1_is_identified_by', label: 'P1 is identified by', comment: 'An identifier or appellation.' },
    { term: 'P2_has_type', label: 'P2 has type', comment: 'A classification of the object.' },
    { term: 'P3_has_note', label: 'P3 has note', comment: 'A free-text note.' },
    { term: 'P4_has_time-span', label: 'P4 has time-span' },
    { term: 'P7_took_place_at', label: 'P7 took place at' },
    { term: 'P43_has_dimension', label: 'P43 has dimension', comment: 'Measurements such as length or weight.' },
    { term: 'P45_consists_of', label: 'P45 consists of', comment: 'The material the object consists of.' },
    { term: 'P46_is_composed_of', label: 'P46 is composed of', comment: 'Parts of the object.' },
    { term: 'P49_has_former_or_current_keeper', label: 'P49 has former or current keeper' },
    { term: 'P50_has_current_keeper', label: 'P50 has current keeper' },
    { term: 'P53_has_former_or_current_location', label: 'P53 has former or current location', comment: 'E.g. the excavation context the object was found in.' },
    { term: 'P55_has_current_location', label: 'P55 has current location' },
    { term: 'P62_depicts', label: 'P62 depicts' },
    { term: 'P70i_is_documented_in', label: 'P70i is documented in', comment: 'Reports or publications documenting the object.' },
    { term: 'P102_has_title', label: 'P102 has title' },
    { term: 'P108i_was_produced_by', label: 'P108i was produced by', comment: 'The production event of the object.' },
    { term: 'P129i_is_subject_of', label: 'P129i is subject of' },
    { term: 'P138i_has_representation', label: 'P138i has representation', comment: 'Images or models representing the object.' },
  ],
};

export const SCHEMA_ORG: Vocabulary = {
  prefix: 'schema',
  namespace: 'https://schema.org/',
  label: 'Schema.org',
  description: 'General-purpose web vocabulary, useful for media and discovery metadata.',
  builtin: true,
  classes: [
    { term: 'CreativeWork', label: 'Creative Work' },
    { term: 'VisualArtwork', label: 'Visual Artwork' },
    { term: 'Photograph', label: 'Photograph' },
    { term: 'Person', label: 'Person' },
    { term: 'Place', label: 'Place' },
    { term: 'ArchiveComponent', label: 'Archive Component' },
  ],
  properties: [
    { term: 'name', label: 'Name' },
    { term: 'description', label: 'Description' },
    { term: 'image', label: 'Image' },
    { term: 'material', label: 'Material' },
    { term: 'dateCreated', label: 'Date Created' },
    { term: 'creator', label: 'Creator' },
    { term: 'locationCreated', label: 'Location Created' },
    { term: 'isPartOf', label: 'Is Part Of' },
    { term: 'keywords', label: 'Keywords' },
    { term: 'url', label: 'URL' },
  ],
};

export const BUILTIN_VOCABULARIES: Vocabulary[] = [DUBLIN_CORE, CIDOC_CRM, SCHEMA_ORG];

/** Namespaces that should be treated as equivalent to a canonical namespace. */
export const NAMESPACE_ALIASES: Record<string, string> = {
  'http://purl.org/dc/elements/1.1/': DUBLIN_CORE.namespace,
  'http://schema.org/': SCHEMA_ORG.namespace,
  'https://schema.org': SCHEMA_ORG.namespace,
  'http://erlangen-crm.org/current/': CIDOC_CRM.namespace,
};

export function findVocabulary(vocabs: Vocabulary[], prefix: string): Vocabulary | undefined {
  return vocabs.find((v) => v.prefix === prefix);
}

/** Human-readable label for a prefixed term, falling back to the local name. */
export function termLabel(vocabs: Vocabulary[], term: string): string {
  const idx = term.indexOf(':');
  if (idx === -1) return term;
  const prefix = term.slice(0, idx);
  const local = term.slice(idx + 1);
  const vocab = findVocabulary(vocabs, prefix);
  if (vocab) {
    const def =
      vocab.properties.find((p) => p.term === local) ??
      vocab.classes.find((c) => c.term === local);
    if (def) return def.label;
  }
  return local.replace(/[_-]+/g, ' ');
}
