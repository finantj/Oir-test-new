export interface PropertyValue {
  /** Prefixed term, e.g. "dcterms:title" or "crm:P45_consists_of" */
  term: string;
  value: string;
  /** BCP-47 language tag, e.g. "ga" or "en" */
  lang?: string;
  /** True when the value is an IRI reference rather than a literal */
  isIri?: boolean;
}

export interface MediaRef {
  url: string;
  caption?: string;
}

export interface ArtifactItem {
  id: string;
  /** Canonical IRI of the artifact (@id) */
  iri?: string;
  /** Prefixed class names, e.g. "crm:E22_Human-Made_Object" */
  types: string[];
  properties: PropertyValue[];
  media: MediaRef[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TermDef {
  /** Local name within the vocabulary namespace, e.g. "title" */
  term: string;
  label: string;
  comment?: string;
}

export interface Vocabulary {
  prefix: string;
  namespace: string;
  label: string;
  description?: string;
  builtin?: boolean;
  classes: TermDef[];
  properties: TermDef[];
}

export interface ExhibitBlock {
  heading?: string;
  text?: string;
  itemIds: string[];
}

export interface Exhibit {
  slug: string;
  title: string;
  summary?: string;
  blocks: ExhibitBlock[];
  createdAt: string;
  updatedAt: string;
}

/** An item parsed from an imported JSON-LD document, before it is saved. */
export interface ParsedItem {
  iri?: string;
  types: string[];
  properties: PropertyValue[];
  media: MediaRef[];
}

export interface ImportPreview {
  items: ParsedItem[];
  warnings: string[];
}
