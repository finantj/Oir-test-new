import type { ArtifactItem, PropertyValue } from './types';

const TITLE_TERMS = ['dcterms:title', 'schema:name', 'crm:P102_has_title', 'crm:P1_is_identified_by'];
const DESCRIPTION_TERMS = ['dcterms:description', 'schema:description', 'crm:P3_has_note'];
const TYPE_TERMS = ['dcterms:type', 'crm:P2_has_type', 'schema:keywords'];
const MATERIAL_TERMS = ['dcterms:medium', 'crm:P45_consists_of', 'schema:material'];
const CONTEXT_TERMS = ['dcterms:spatial', 'crm:P53_has_former_or_current_location', 'schema:locationCreated'];
const PERIOD_TERMS = ['dcterms:temporal', 'crm:P4_has_time-span', 'dcterms:date', 'schema:dateCreated'];
const IDENTIFIER_TERMS = ['dcterms:identifier', 'crm:P1_is_identified_by'];

export function firstValue(item: { properties: PropertyValue[] }, terms: string[]): string | undefined {
  for (const term of terms) {
    const found = item.properties.find((p) => p.term === term && !p.isIri);
    if (found) return found.value;
  }
  for (const term of terms) {
    const found = item.properties.find((p) => p.term === term);
    if (found) return found.value;
  }
  return undefined;
}

export function allValues(item: { properties: PropertyValue[] }, terms: string[]): string[] {
  const out: string[] = [];
  for (const term of terms) {
    for (const p of item.properties) {
      if (p.term === term && !out.includes(p.value)) out.push(p.value);
    }
  }
  return out;
}

export function itemTitle(item: ArtifactItem): string {
  return firstValue(item, TITLE_TERMS) ?? item.id;
}

export function itemDescription(item: { properties: PropertyValue[] }): string | undefined {
  return firstValue(item, DESCRIPTION_TERMS);
}

export function itemIdentifier(item: ArtifactItem): string | undefined {
  return firstValue(item, IDENTIFIER_TERMS);
}

export function itemObjectType(item: ArtifactItem): string | undefined {
  return firstValue(item, TYPE_TERMS);
}

export function itemMaterial(item: ArtifactItem): string | undefined {
  return firstValue(item, MATERIAL_TERMS);
}

export function itemContext(item: ArtifactItem): string | undefined {
  return firstValue(item, CONTEXT_TERMS);
}

export function itemPeriod(item: ArtifactItem): string | undefined {
  return firstValue(item, PERIOD_TERMS);
}

export interface FacetValues {
  types: string[];
  materials: string[];
  contexts: string[];
  periods: string[];
}

export function collectFacets(items: ArtifactItem[]): FacetValues {
  const add = (set: Set<string>, value?: string) => {
    if (value) set.add(value);
  };
  const types = new Set<string>();
  const materials = new Set<string>();
  const contexts = new Set<string>();
  const periods = new Set<string>();
  for (const item of items) {
    add(types, itemObjectType(item));
    add(materials, itemMaterial(item));
    add(contexts, itemContext(item));
    add(periods, itemPeriod(item));
  }
  const sorted = (s: Set<string>) => Array.from(s).sort((a, b) => a.localeCompare(b));
  return {
    types: sorted(types),
    materials: sorted(materials),
    contexts: sorted(contexts),
    periods: sorted(periods),
  };
}
