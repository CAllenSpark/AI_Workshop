/**
 * Integration tests for export functionality
 * Covers: IT-004 (export generation -> schema validation)
 */
import { describe, it, expect } from 'vitest';
import { buildTestStore } from '../__fixtures__/test-data';
import type { DataStore, TimelineEntry } from '../types';
import { ERAS } from '../data/eras';

/**
 * Simulates the ExportDialog's buildExport logic (extracted for testability)
 */
function buildExport(
  data: DataStore,
  exportEntries: TimelineEntry[],
  options: {
    includeDetails?: boolean;
    includeSources?: boolean;
    includeCoordinates?: boolean;
  } = {}
) {
  const { includeDetails = true, includeSources = true, includeCoordinates = true } = options;
  const entryIds = new Set(exportEntries.map((e) => e.id));

  const referencedPeople = new Set<string>();
  const referencedPlaces = new Set<string>();
  for (const entry of exportEntries) {
    entry.people.forEach((p) => referencedPeople.add(p));
    entry.places.forEach((p) => referencedPlaces.add(p));
  }

  const activeEraKeys = new Set(exportEntries.map((e) => e.era));
  const eras = ERAS.filter((era) => activeEraKeys.has(era.key)).map((era) => ({
    key: era.key,
    name: era.name,
    start: era.start < 0 ? `~${Math.abs(era.start)} BCE` : `${era.start}`,
    end: era.end === 2026 ? 'present' : `${era.end}`,
    context_summary: `The ${era.name} era of Vashon Island history.`,
  }));

  const entries = exportEntries.map((entry) => {
    const people = entry.people
      .map((name) => data.peopleByName.get(name))
      .filter(Boolean)
      .map((p) => ({
        id: p!.id,
        name: p!.name,
        role: p!.role,
        description: p!.description,
      }));

    const places = entry.places
      .map((name) => data.placesByName.get(name))
      .filter(Boolean)
      .map((p) => {
        const base: Record<string, unknown> = {
          id: p!.id,
          name: p!.name,
          type: p!.type,
          description: p!.description,
        };
        if (includeCoordinates && p!.coordinates) {
          base.coordinates = p!.coordinates;
        }
        return base;
      });

    const result: Record<string, unknown> = {
      id: entry.id,
      title: entry.title,
      date_start: entry.date_start,
      era: entry.era,
      layers: entry.layers,
      description: entry.description,
      tags: entry.tags,
      people,
      places,
    };

    if (entry.date_end) result.date_end = entry.date_end;
    if (includeDetails && entry.details) result.details = entry.details;
    if (includeSources && entry.sources.length > 0) {
      result.sources = entry.sources.map((s) => ({
        title: s.title,
        type: s.type,
        ...(s.url ? { url: s.url } : {}),
      }));
    }

    return result;
  });

  const topLevelPeople = data.people
    .filter((p) => referencedPeople.has(p.name))
    .map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      role: p.role,
      related_entry_ids: (p.related_entries || []).filter((id) => entryIds.has(id)),
    }));

  const topLevelPlaces = data.places
    .filter((p) => referencedPlaces.has(p.name))
    .map((p) => {
      const base: Record<string, unknown> = {
        id: p.id,
        name: p.name,
        type: p.type,
        description: p.description,
        related_entry_ids: (p.related_entries || []).filter((id) => entryIds.has(id)),
      };
      if (includeCoordinates && p.coordinates) {
        base.coordinates = p.coordinates;
      }
      return base;
    });

  const environmentFeatures = data.environment.map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    description: e.description,
    time_relevance: e.time_relevance,
  }));

  return {
    export_metadata: {
      setting: 'Vashon Island, WA',
      generated_at: new Date().toISOString(),
      entry_count: entries.length,
      version: '1.0',
    },
    eras,
    entries,
    people: topLevelPeople,
    places: topLevelPlaces,
    environment_features: environmentFeatures,
  };
}

describe('Export Integration', () => {
  const store = buildTestStore();

  it('IT-004: export all entries produces valid structure', () => {
    const exported = buildExport(store, store.entries);

    // Metadata
    expect(exported.export_metadata.setting).toBe('Vashon Island, WA');
    expect(exported.export_metadata.version).toBe('1.0');
    expect(exported.export_metadata.entry_count).toBe(store.entries.length);
    expect(exported.export_metadata.generated_at).toBeTruthy();

    // Entries
    expect(exported.entries.length).toBe(store.entries.length);
    for (const entry of exported.entries) {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('title');
      expect(entry).toHaveProperty('date_start');
      expect(entry).toHaveProperty('era');
      expect(entry).toHaveProperty('layers');
      expect(entry).toHaveProperty('description');
    }

    // Eras
    expect(exported.eras.length).toBeGreaterThan(0);
    for (const era of exported.eras) {
      expect(era).toHaveProperty('key');
      expect(era).toHaveProperty('name');
      expect(era).toHaveProperty('start');
      expect(era).toHaveProperty('end');
    }

    // Environment features
    expect(exported.environment_features.length).toBe(store.environment.length);
  });

  it('IT-004: export is valid JSON (round-trips)', () => {
    const exported = buildExport(store, store.entries);
    const json = JSON.stringify(exported);
    const parsed = JSON.parse(json);

    expect(parsed.export_metadata.entry_count).toBe(store.entries.length);
    expect(parsed.entries.length).toBe(store.entries.length);
  });

  it('IT-004: filtered export contains only filtered entries', () => {
    const pioneerOnly = store.entries.filter((e) => e.era === 'pioneer');
    const exported = buildExport(store, pioneerOnly);

    expect(exported.entries.length).toBe(pioneerOnly.length);
    for (const entry of exported.entries) {
      expect(entry.era).toBe('pioneer');
    }
  });

  it('IT-004: export includes people referenced by entries', () => {
    const exported = buildExport(store, store.entries);

    // Alice Pioneer is referenced by e-001 and e-002
    const alice = exported.people.find((p) => p.name === 'Alice Pioneer');
    expect(alice).toBeDefined();
    expect(alice!.role).toBe('homesteader');
  });

  it('IT-004: export excludes unreferenced people', () => {
    const exported = buildExport(store, store.entries);

    // 'Orphan Person' is not referenced by any entry
    const orphan = exported.people.find((p) => p.name === 'Orphan Person');
    expect(orphan).toBeUndefined();
  });

  it('includes coordinates when includeCoordinates is true', () => {
    const exported = buildExport(store, store.entries, { includeCoordinates: true });

    const landing = exported.places.find((p) => p.name === 'Test Landing');
    expect(landing).toBeDefined();
    expect(landing!.coordinates).toEqual({ lat: 47.44, lng: -122.46 });
  });

  it('excludes coordinates when includeCoordinates is false', () => {
    const exported = buildExport(store, store.entries, { includeCoordinates: false });

    const landing = exported.places.find((p) => p.name === 'Test Landing');
    expect(landing).toBeDefined();
    expect(landing!.coordinates).toBeUndefined();
  });

  it('includes details when includeDetails is true', () => {
    const exported = buildExport(store, store.entries, { includeDetails: true });

    const settlement = exported.entries.find((e) => e.id === 'e-001');
    expect(settlement!.details).toBe('Extended details about the settlement founding.');
  });

  it('excludes details when includeDetails is false', () => {
    const exported = buildExport(store, store.entries, { includeDetails: false });

    const settlement = exported.entries.find((e) => e.id === 'e-001');
    expect(settlement!.details).toBeUndefined();
  });

  it('excludes sources when includeSources is false', () => {
    const exported = buildExport(store, store.entries, { includeSources: false });

    const settlement = exported.entries.find((e) => e.id === 'e-001');
    expect(settlement!.sources).toBeUndefined();
  });

  it('empty export when no entries selected', () => {
    const exported = buildExport(store, []);

    expect(exported.entries).toHaveLength(0);
    expect(exported.export_metadata.entry_count).toBe(0);
    expect(exported.people).toHaveLength(0);
    expect(exported.places).toHaveLength(0);
    expect(exported.eras).toHaveLength(0);
  });
});
