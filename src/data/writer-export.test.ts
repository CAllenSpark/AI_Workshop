/**
 * Unit tests for Writer Export generators
 * Covers: character dossiers, location guides, props catalog, combined export
 */
import { describe, it, expect } from 'vitest';
import { buildTestStore } from '../__fixtures__/test-data';
import {
  buildCharacterDossiers,
  buildLocationGuides,
  buildPropsCatalog,
  buildWriterExport,
} from './writer-export';

describe('buildCharacterDossiers', () => {
  it('returns metadata with correct type and count', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    expect(result.export_metadata.type).toBe('character-dossiers');
    expect(result.export_metadata.character_count).toBe(data.people.length);
    expect(result.export_metadata.version).toBe('1.0');
  });

  it('includes all characters from the data store', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const names = result.characters.map((c) => c.name);
    expect(names).toContain('Alice Pioneer');
    expect(names).toContain('The Tidewalker');
  });

  it('sorts fantasy characters before historical', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const tidewalkerIdx = result.characters.findIndex((c) => c.name === 'The Tidewalker');
    const aliceIdx = result.characters.findIndex((c) => c.name === 'Alice Pioneer');
    expect(tidewalkerIdx).toBeLessThan(aliceIdx);
  });

  it('resolves character appearances from timeline entries', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const alice = result.characters.find((c) => c.name === 'Alice Pioneer')!;
    expect(alice.appearances.length).toBe(2);
    expect(alice.appearances[0].title).toBe('Pioneer Settlement Founded');
    expect(alice.appearances[1].title).toBe('Logging Operation Begins');
  });

  it('sorts appearances chronologically', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const alice = result.characters.find((c) => c.name === 'Alice Pioneer')!;
    // 1870 < 1880
    expect(alice.appearances[0].date_start).toBe('1870');
    expect(alice.appearances[1].date_start).toBe('1880');
  });

  it('groups creative entries by arc', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const tidewalker = result.characters.find((c) => c.name === 'The Tidewalker')!;
    expect(tidewalker.arcs).toHaveProperty('tidewalker-awakening');
    expect(tidewalker.arcs['tidewalker-awakening'].length).toBe(1);
  });

  it('includes narrative beat in appearances', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const tidewalker = result.characters.find((c) => c.name === 'The Tidewalker')!;
    const fantasyAppearance = tidewalker.appearances.find((a) => a.entry_id === 'e-fan-001');
    expect(fantasyAppearance?.beat).toBe('inciting-incident');
    expect(fantasyAppearance?.arc).toBe('tidewalker-awakening');
  });

  it('includes personality, motivation, speech_style for fantasy characters', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const tidewalker = result.characters.find((c) => c.name === 'The Tidewalker')!;
    expect(tidewalker.personality).toBe('Ancient and patient');
    expect(tidewalker.motivation).toBe('Restore ecological memory');
    expect(tidewalker.speech_style).toBe('Archaic, rhythmic');
  });

  it('resolves associated props', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const tidewalker = result.characters.find((c) => c.name === 'The Tidewalker')!;
    expect(tidewalker.props.length).toBe(1);
    expect(tidewalker.props[0].name).toBe('Glacial Memory Stone');
    expect(tidewalker.props[0].narrative_function).toBe('key');
  });

  it('resolves associated places', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const alice = result.characters.find((c) => c.name === 'Alice Pioneer')!;
    expect(alice.associated_places).toContain('Test Landing');
  });

  it('handles characters with no appearances', () => {
    const data = buildTestStore();
    const result = buildCharacterDossiers(data);

    const orphan = result.characters.find((c) => c.name === 'Orphan Person')!;
    expect(orphan.appearances.length).toBe(0);
    expect(Object.keys(orphan.arcs).length).toBe(0);
  });
});

describe('buildLocationGuides', () => {
  it('returns metadata with correct type and count', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    expect(result.export_metadata.type).toBe('location-guides');
    expect(result.export_metadata.location_count).toBe(data.places.length);
  });

  it('resolves events at each location', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    const harbor = result.locations.find((l) => l.name === 'Test Harbor')!;
    expect(harbor.event_count).toBe(2); // Explorer Arrives + Tidewalker Emerges
  });

  it('organizes events by era in chronological order', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    const harbor = result.locations.find((l) => l.name === 'Test Harbor')!;
    // First era section should be exploration (1792), then wwii (1942)
    expect(harbor.timeline[0].era_key).toBe('exploration');
    expect(harbor.timeline[1].era_key).toBe('wwii');
  });

  it('includes era name in timeline sections', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    const harbor = result.locations.find((l) => l.name === 'Test Harbor')!;
    expect(harbor.timeline[0].era_name).toBe('Exploration');
  });

  it('sorts locations by event count descending', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    for (let i = 1; i < result.locations.length; i++) {
      expect(result.locations[i - 1].event_count).toBeGreaterThanOrEqual(result.locations[i].event_count);
    }
  });

  it('resolves associated people for each location', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    const landing = result.locations.find((l) => l.name === 'Test Landing')!;
    expect(landing.associated_people).toContain('Alice Pioneer');
  });

  it('resolves associated props for each location', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    const harbor = result.locations.find((l) => l.name === 'Test Harbor')!;
    expect(harbor.props.length).toBe(1);
    expect(harbor.props[0].name).toBe('Glacial Memory Stone');
  });

  it('handles locations with no events', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    // Test Forest appears in 1 entry only (e-006), but might also have 0 events for other places
    const forest = result.locations.find((l) => l.name === 'Test Forest')!;
    expect(forest.event_count).toBe(1);
  });

  it('includes coordinates when available', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    const landing = result.locations.find((l) => l.name === 'Test Landing')!;
    expect(landing.coordinates).toEqual({ lat: 47.44, lng: -122.46 });
  });

  it('includes entry_type for fantasy and historical events', () => {
    const data = buildTestStore();
    const result = buildLocationGuides(data);

    const harbor = result.locations.find((l) => l.name === 'Test Harbor')!;
    const allEvents = harbor.timeline.flatMap((s) => s.events);
    const historical = allEvents.find((e) => e.entry_id === 'e-003');
    const fantasy = allEvents.find((e) => e.entry_id === 'e-fan-001');
    expect(historical?.entry_type).toBe('historical');
    expect(fantasy?.entry_type).toBe('fantasy');
  });
});

describe('buildPropsCatalog', () => {
  it('returns metadata with correct type and count', () => {
    const data = buildTestStore();
    const result = buildPropsCatalog(data);

    expect(result.export_metadata.type).toBe('props-catalog');
    expect(result.export_metadata.prop_count).toBe(1); // one test prop
  });

  it('resolves prop appearances from entries', () => {
    const data = buildTestStore();
    const result = buildPropsCatalog(data);

    const stone = result.props[0];
    expect(stone.name).toBe('Glacial Memory Stone');
    expect(stone.appearances.length).toBe(2); // e-fan-001 and e-005
  });

  it('sorts appearances chronologically', () => {
    const data = buildTestStore();
    const result = buildPropsCatalog(data);

    const stone = result.props[0];
    // e-005 (~15000 BCE) should come before e-fan-001 (1942)
    expect(stone.appearances[0].entry_id).toBe('e-005');
    expect(stone.appearances[1].entry_id).toBe('e-fan-001');
  });

  it('includes narrative function and plot significance', () => {
    const data = buildTestStore();
    const result = buildPropsCatalog(data);

    const stone = result.props[0];
    expect(stone.narrative_function).toBe('key');
    expect(stone.plot_significance).toContain('unlocks');
  });

  it('resolves associated people', () => {
    const data = buildTestStore();
    const result = buildPropsCatalog(data);

    const stone = result.props[0];
    expect(stone.people.length).toBe(1);
    expect(stone.people[0].name).toBe('The Tidewalker');
  });

  it('resolves associated places', () => {
    const data = buildTestStore();
    const result = buildPropsCatalog(data);

    const stone = result.props[0];
    expect(stone.places.length).toBe(1);
    expect(stone.places[0].name).toBe('Test Harbor');
  });

  it('handles empty props array', () => {
    const data = buildTestStore();
    data.props = [];
    const result = buildPropsCatalog(data);

    expect(result.props.length).toBe(0);
    expect(result.export_metadata.prop_count).toBe(0);
  });
});

describe('buildWriterExport', () => {
  it('returns combined export with all three sections', () => {
    const data = buildTestStore();
    const result = buildWriterExport(data);

    expect(result.export_metadata.type).toBe('writer-full');
    expect(result.characters).toBeDefined();
    expect(result.locations).toBeDefined();
    expect(result.props).toBeDefined();
  });

  it('character count matches people count', () => {
    const data = buildTestStore();
    const result = buildWriterExport(data);

    expect(result.characters.export_metadata.character_count).toBe(data.people.length);
  });

  it('location count matches places count', () => {
    const data = buildTestStore();
    const result = buildWriterExport(data);

    expect(result.locations.export_metadata.location_count).toBe(data.places.length);
  });

  it('prop count matches props count', () => {
    const data = buildTestStore();
    const result = buildWriterExport(data);

    expect(result.props.export_metadata.prop_count).toBe(data.props.length);
  });
});
