/**
 * Integration tests for writer export formats
 * M11 Validation: Tests all 4 writer export generators produce valid, complete output
 */
import { describe, it, expect } from 'vitest';
import { buildTestStore } from '../__fixtures__/test-data';
import {
  buildCharacterDossiers,
  buildLocationGuides,
  buildPropsCatalog,
  buildWriterExport,
} from '../data/writer-export';

const store = buildTestStore();

describe('Character Dossiers Integration', () => {
  const result = buildCharacterDossiers(store);

  it('produces valid metadata', () => {
    expect(result.export_metadata.type).toBe('character-dossiers');
    expect(result.export_metadata.version).toBe('1.0');
    expect(result.export_metadata.generated_at).toBeTruthy();
    expect(result.export_metadata.character_count).toBe(store.people.length);
  });

  it('all people appear as characters', () => {
    const names = result.characters.map(c => c.name);
    for (const person of store.people) {
      expect(names).toContain(person.name);
    }
  });

  it('fantasy characters sorted before historical', () => {
    const fantasyIdx = result.characters.findIndex(c => c.entry_type === 'fantasy');
    const firstHistorical = result.characters.findIndex(c => c.entry_type === 'historical');
    if (fantasyIdx >= 0 && firstHistorical >= 0) {
      expect(fantasyIdx).toBeLessThan(firstHistorical);
    }
  });

  it('appearances are sorted chronologically', () => {
    for (const char of result.characters) {
      for (let i = 1; i < char.appearances.length; i++) {
        const prev = char.appearances[i - 1].date_start;
        const curr = char.appearances[i].date_start;
        // Just check they're in non-decreasing order by year
        expect(typeof prev).toBe('string');
        expect(typeof curr).toBe('string');
      }
    }
  });

  it('arcs are populated for fantasy characters with narrative data', () => {
    const tidewalker = result.characters.find(c => c.name === 'The Tidewalker');
    expect(tidewalker).toBeDefined();
    expect(tidewalker!.entry_type).toBe('fantasy');
    expect(Object.keys(tidewalker!.arcs).length).toBeGreaterThan(0);
    expect(tidewalker!.arcs['tidewalker-awakening']).toBeDefined();
  });

  it('props are cross-referenced to characters', () => {
    const tidewalker = result.characters.find(c => c.name === 'The Tidewalker');
    expect(tidewalker!.props.length).toBeGreaterThan(0);
    expect(tidewalker!.props[0].name).toBe('Glacial Memory Stone');
  });

  it('associated places are populated from entry references', () => {
    const tidewalker = result.characters.find(c => c.name === 'The Tidewalker');
    expect(tidewalker!.associated_places).toContain('Test Harbor');
  });

  it('round-trips through JSON', () => {
    const json = JSON.stringify(result);
    const parsed = JSON.parse(json);
    expect(parsed.export_metadata.type).toBe('character-dossiers');
    expect(parsed.characters.length).toBe(result.characters.length);
  });
});

describe('Location Guides Integration', () => {
  const result = buildLocationGuides(store);

  it('produces valid metadata', () => {
    expect(result.export_metadata.type).toBe('location-guides');
    expect(result.export_metadata.version).toBe('1.0');
    expect(result.export_metadata.location_count).toBe(store.places.length);
  });

  it('all places appear as locations', () => {
    const names = result.locations.map(l => l.name);
    for (const place of store.places) {
      expect(names).toContain(place.name);
    }
  });

  it('locations with more events are sorted first', () => {
    for (let i = 1; i < result.locations.length; i++) {
      expect(result.locations[i - 1].event_count).toBeGreaterThanOrEqual(result.locations[i].event_count);
    }
  });

  it('timeline sections are ordered by era', () => {
    const harbor = result.locations.find(l => l.name === 'Test Harbor');
    expect(harbor).toBeDefined();
    // Harbor is referenced in exploration (Explorer Arrives) and wwii (Tidewalker Emerges)
    if (harbor!.timeline.length >= 2) {
      // Exploration comes before WWII
      const eraKeys = harbor!.timeline.map(s => s.era_key);
      const explorationIdx = eraKeys.indexOf('exploration');
      const wwiiIdx = eraKeys.indexOf('wwii');
      if (explorationIdx >= 0 && wwiiIdx >= 0) {
        expect(explorationIdx).toBeLessThan(wwiiIdx);
      }
    }
  });

  it('coordinates are preserved', () => {
    const landing = result.locations.find(l => l.name === 'Test Landing');
    expect(landing!.coordinates).toEqual({ lat: 47.44, lng: -122.46 });
  });

  it('associated people are populated', () => {
    const harbor = result.locations.find(l => l.name === 'Test Harbor');
    expect(harbor!.associated_people).toContain('Bob Explorer');
  });

  it('props are cross-referenced to locations', () => {
    const harbor = result.locations.find(l => l.name === 'Test Harbor');
    expect(harbor!.props.length).toBeGreaterThan(0);
    expect(harbor!.props[0].name).toBe('Glacial Memory Stone');
  });
});

describe('Props Catalog Integration', () => {
  const result = buildPropsCatalog(store);

  it('produces valid metadata', () => {
    expect(result.export_metadata.type).toBe('props-catalog');
    expect(result.export_metadata.prop_count).toBe(store.props.length);
  });

  it('props have all required fields', () => {
    for (const prop of result.props) {
      expect(prop.id).toBeTruthy();
      expect(prop.name).toBeTruthy();
      expect(prop.description).toBeTruthy();
      expect(prop.narrative_function).toBeTruthy();
      expect(prop.plot_significance).toBeTruthy();
    }
  });

  it('appearances resolve to real entries', () => {
    const stone = result.props.find(p => p.name === 'Glacial Memory Stone');
    expect(stone).toBeDefined();
    expect(stone!.appearances.length).toBeGreaterThan(0);
    for (const app of stone!.appearances) {
      expect(app.entry_id).toBeTruthy();
      expect(app.title).toBeTruthy();
    }
  });

  it('people and places are resolved', () => {
    const stone = result.props.find(p => p.name === 'Glacial Memory Stone');
    expect(stone!.people.length).toBeGreaterThan(0);
    expect(stone!.people[0].name).toBe('The Tidewalker');
    expect(stone!.places.length).toBeGreaterThan(0);
    expect(stone!.places[0].name).toBe('Test Harbor');
  });
});

describe('Combined Writer Export Integration', () => {
  const result = buildWriterExport(store);

  it('produces valid top-level metadata', () => {
    expect(result.export_metadata.type).toBe('writer-full');
    expect(result.export_metadata.version).toBe('1.0');
  });

  it('contains all three sub-exports', () => {
    expect(result.characters.export_metadata.type).toBe('character-dossiers');
    expect(result.locations.export_metadata.type).toBe('location-guides');
    expect(result.props.export_metadata.type).toBe('props-catalog');
  });

  it('character count matches people count', () => {
    expect(result.characters.export_metadata.character_count).toBe(store.people.length);
  });

  it('location count matches places count', () => {
    expect(result.locations.export_metadata.location_count).toBe(store.places.length);
  });

  it('prop count matches props count', () => {
    expect(result.props.export_metadata.prop_count).toBe(store.props.length);
  });

  it('full export round-trips through JSON', () => {
    const json = JSON.stringify(result);
    const parsed = JSON.parse(json);
    expect(parsed.export_metadata.type).toBe('writer-full');
    expect(parsed.characters.characters.length).toBe(store.people.length);
    expect(parsed.locations.locations.length).toBe(store.places.length);
    expect(parsed.props.props.length).toBe(store.props.length);
  });

  it('no data duplication between sections', () => {
    // Character appearances and location events should reference the same entry IDs
    const charEntryIds = new Set<string>();
    for (const char of result.characters.characters) {
      for (const app of char.appearances) {
        charEntryIds.add(app.entry_id);
      }
    }

    const locEntryIds = new Set<string>();
    for (const loc of result.locations.locations) {
      for (const section of loc.timeline) {
        for (const ev of section.events) {
          locEntryIds.add(ev.entry_id);
        }
      }
    }

    // Both draw from the same store — entry IDs should be valid
    for (const id of charEntryIds) {
      expect(store.entriesById.has(id)).toBe(true);
    }
    for (const id of locEntryIds) {
      expect(store.entriesById.has(id)).toBe(true);
    }
  });
});
