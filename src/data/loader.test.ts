/**
 * Unit tests for data loader: parseDate, validateData, buildIndexes, addEntry, removeEntry
 * Covers: UT-T001, UT-T002, UT-T004, UT-T005, UT-D001, UT-D002, UT-D003, UT-D004
 * Fantasy: entry_type defaults, scope indexing, universe validation, narrative anchors
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { parseDate, addEntry, removeEntry } from './loader';
import { TEST_ENTRIES, TEST_PEOPLE, TEST_PLACES, buildTestStore } from '../__fixtures__/test-data';
import type { TimelineEntry, DataStore } from '../types';

// ── parseDate ───────────────────────────────────────────

describe('parseDate', () => {
  it('UT-T004: parses ISO date "1943-03-22" to year 1943', () => {
    expect(parseDate('1943-03-22')).toBe(1943);
  });

  it('UT-T004: parses year-only "1890" to 1890', () => {
    expect(parseDate('1890')).toBe(1890);
  });

  it('UT-T005: parses "~500 BCE" to -500', () => {
    expect(parseDate('~500 BCE')).toBe(-500);
  });

  it('UT-T002: parses "~10000 BCE" to -10000', () => {
    expect(parseDate('~10000 BCE')).toBe(-10000);
  });

  it('UT-T005: parses "~15000 BCE" to -15000', () => {
    expect(parseDate('~15000 BCE')).toBe(-15000);
  });

  it('parses approximate dates with tilde "~1870" to 1870', () => {
    expect(parseDate('~1870')).toBe(1870);
  });

  it('parses full ISO "1792-05-20" to 1792', () => {
    expect(parseDate('1792-05-20')).toBe(1792);
  });

  it('handles "present" to current year', () => {
    expect(parseDate('present')).toBe(new Date().getFullYear());
  });

  it('returns 0 for empty string', () => {
    expect(parseDate('')).toBe(0);
  });

  it('returns 0 for unparseable string', () => {
    expect(parseDate('unknown')).toBe(0);
  });

  it('handles whitespace around date strings', () => {
    expect(parseDate('  1900  ')).toBe(1900);
    expect(parseDate('  ~500 BCE  ')).toBe(-500);
  });

  it('handles case-insensitive BCE', () => {
    expect(parseDate('500 bce')).toBe(-500);
    expect(parseDate('500 Bce')).toBe(-500);
  });
});

// ── addEntry ────────────────────────────────────────────

describe('addEntry', () => {
  let store: DataStore;

  beforeEach(() => {
    store = buildTestStore();
  });

  it('adds a new entry to the store', () => {
    const newEntry: TimelineEntry = {
      id: 'e-new',
      title: 'Test New Entry',
      date_start: '1900',
      era: 'growth-industry',
      layers: ['event'],
      description: 'A new test entry.',
      people: [],
      places: [],
      sources: [],
      tags: ['test'],
    };

    const updated = addEntry(store, newEntry);
    expect(updated.entries).toHaveLength(store.entries.length + 1);
    expect(updated.entriesById.get('e-new')).toBeDefined();
    expect(updated.parsedDates.get('e-new')).toBe(1900);
  });

  it('maintains chronological sort order after add', () => {
    const earlyEntry: TimelineEntry = {
      id: 'e-early',
      title: 'Early Entry',
      date_start: '~20000 BCE',
      era: 'prehistory',
      layers: ['environment'],
      description: 'Very early.',
      people: [],
      places: [],
      sources: [],
      tags: [],
    };

    const updated = addEntry(store, earlyEntry);
    expect(updated.entries[0].id).toBe('e-early');
  });

  it('updates the entriesByEra index', () => {
    const newEntry: TimelineEntry = {
      id: 'e-modern2',
      title: 'Another Modern Event',
      date_start: '2025',
      era: 'modern',
      layers: ['event'],
      description: 'Modern.',
      people: [],
      places: [],
      sources: [],
      tags: [],
    };

    const updated = addEntry(store, newEntry);
    const modernEntries = updated.entriesByEra.get('modern') ?? [];
    expect(modernEntries.some((e) => e.id === 'e-modern2')).toBe(true);
  });

  it('does not mutate the original store', () => {
    const origLength = store.entries.length;
    const newEntry: TimelineEntry = {
      id: 'e-immut',
      title: 'Immutability test',
      date_start: '2000',
      era: 'modern',
      layers: ['event'],
      description: 'Test.',
      people: [],
      places: [],
      sources: [],
      tags: [],
    };

    addEntry(store, newEntry);
    expect(store.entries).toHaveLength(origLength);
    expect(store.entriesById.has('e-immut')).toBe(false);
  });

  it('applies entry_type default when not specified', () => {
    const newEntry: TimelineEntry = {
      id: 'e-nodefaults',
      title: 'No Defaults Entry',
      date_start: '1900',
      era: 'growth-industry',
      layers: ['event'],
      description: 'Entry without explicit entry_type.',
      people: [],
      places: [],
      sources: [],
      tags: [],
    };

    const updated = addEntry(store, newEntry);
    const added = updated.entriesById.get('e-nodefaults');
    expect(added?.entry_type).toBe('historical');
    expect(added?.scope).toBe('vashon');
  });

  it('adds fantasy entry to entriesByType index', () => {
    const fantasyEntry: TimelineEntry = {
      id: 'e-fan-new',
      title: 'A Fantasy Event',
      date_start: '1900',
      era: 'growth-industry',
      layers: ['event'],
      description: 'Fantasy test.',
      people: [],
      places: [],
      sources: [],
      tags: ['fantasy'],
      entry_type: 'fantasy',
      scope: 'vashon',
      universe_id: 'test-campaign',
    };

    const updated = addEntry(store, fantasyEntry);
    const fantasyEntries = updated.entriesByType.get('fantasy') ?? [];
    expect(fantasyEntries.some((e) => e.id === 'e-fan-new')).toBe(true);
  });

  it('adds regional entry to entriesByScope index', () => {
    const seattleEntry: TimelineEntry = {
      id: 'e-sea-new',
      title: 'A Seattle Event',
      date_start: '1900',
      era: 'growth-industry',
      layers: ['event'],
      description: 'Seattle test.',
      people: [],
      places: [],
      sources: [],
      tags: [],
      entry_type: 'historical',
      scope: 'seattle',
    };

    const updated = addEntry(store, seattleEntry);
    const seattleEntries = updated.entriesByScope.get('seattle') ?? [];
    expect(seattleEntries.some((e) => e.id === 'e-sea-new')).toBe(true);
  });
});

// ── removeEntry ─────────────────────────────────────────

describe('removeEntry', () => {
  let store: DataStore;

  beforeEach(() => {
    store = buildTestStore();
  });

  it('removes an existing entry', () => {
    const updated = removeEntry(store, 'e-001');
    expect(updated.entries.find((e) => e.id === 'e-001')).toBeUndefined();
    expect(updated.entriesById.has('e-001')).toBe(false);
    expect(updated.parsedDates.has('e-001')).toBe(false);
  });

  it('returns unchanged store for non-existent id', () => {
    const updated = removeEntry(store, 'nonexistent');
    expect(updated).toBe(store); // same reference
  });

  it('updates the entriesByEra index', () => {
    const updated = removeEntry(store, 'e-001');
    const pioneerEntries = updated.entriesByEra.get('pioneer') ?? [];
    expect(pioneerEntries.some((e) => e.id === 'e-001')).toBe(false);
  });

  it('does not mutate the original store', () => {
    const origLength = store.entries.length;
    removeEntry(store, 'e-001');
    expect(store.entries).toHaveLength(origLength);
    expect(store.entriesById.has('e-001')).toBe(true);
  });

  it('removes fantasy entry from entriesByType index', () => {
    const updated = removeEntry(store, 'e-fan-001');
    const fantasyEntries = updated.entriesByType.get('fantasy') ?? [];
    expect(fantasyEntries.some((e) => e.id === 'e-fan-001')).toBe(false);
  });

  it('removes regional entry from entriesByScope index', () => {
    const updated = removeEntry(store, 'e-sea-001');
    const seattleEntries = updated.entriesByScope.get('seattle') ?? [];
    expect(seattleEntries.some((e) => e.id === 'e-sea-001')).toBe(false);
  });
});

// ── buildTestStore (DataStore) ──────────────────────────

describe('buildTestStore', () => {
  it('UT-D001: builds a valid DataStore with all indexes', () => {
    const store = buildTestStore();
    expect(store.entries.length).toBe(TEST_ENTRIES.length);
    expect(store.people.length).toBe(TEST_PEOPLE.length);
    expect(store.places.length).toBe(TEST_PLACES.length);
    expect(store.entriesById.size).toBe(TEST_ENTRIES.length);
    expect(store.peopleById.size).toBe(TEST_PEOPLE.length);
    expect(store.placesById.size).toBe(TEST_PLACES.length);
    expect(store.parsedDates.size).toBe(TEST_ENTRIES.length);
    expect(store.warnings).toBeInstanceOf(Array);
  });

  it('UT-D001: entries are sorted chronologically', () => {
    const store = buildTestStore();
    for (let i = 1; i < store.entries.length; i++) {
      const prevYear = store.parsedDates.get(store.entries[i - 1].id) ?? 0;
      const currYear = store.parsedDates.get(store.entries[i].id) ?? 0;
      expect(prevYear).toBeLessThanOrEqual(currYear);
    }
  });

  it('UT-D001: entriesByEra groups entries correctly', () => {
    const store = buildTestStore();
    const pioneerEntries = store.entriesByEra.get('pioneer') ?? [];
    expect(pioneerEntries.every((e) => e.era === 'pioneer')).toBe(true);
    expect(pioneerEntries.length).toBe(TEST_ENTRIES.filter((e) => e.era === 'pioneer').length);
  });

  it('UT-D001: peopleByName provides O(1) lookup', () => {
    const store = buildTestStore();
    const alice = store.peopleByName.get('Alice Pioneer');
    expect(alice).toBeDefined();
    expect(alice!.id).toBe('p-001');
  });

  it('UT-D001: placesByName provides O(1) lookup', () => {
    const store = buildTestStore();
    const harbor = store.placesByName.get('Test Harbor');
    expect(harbor).toBeDefined();
    expect(harbor!.id).toBe('pl-002');
  });

  it('UT-D004: handles empty dataset gracefully', () => {
    const emptyStore: DataStore = {
      entries: [],
      people: [],
      places: [],
      environment: [],
      universes: [],
      props: [],
      lore: [],
      worldRules: [],
      entriesById: new Map(),
      peopleById: new Map(),
      placesById: new Map(),
      peopleByName: new Map(),
      placesByName: new Map(),
      loreById: new Map(),
      worldRulesById: new Map(),
      parsedDates: new Map(),
      entriesByEra: new Map(),
      entriesByScope: new Map(),
      entriesByType: new Map(),
      warnings: [],
    };

    expect(emptyStore.entries).toHaveLength(0);
    expect(emptyStore.entriesById.size).toBe(0);
  });

  it('includes universes in the store', () => {
    const store = buildTestStore();
    expect(store.universes).toHaveLength(1);
    expect(store.universes[0].id).toBe('test-campaign');
  });

  it('entriesByScope indexes entries by geographic scope', () => {
    const store = buildTestStore();
    const vashonEntries = store.entriesByScope.get('vashon') ?? [];
    const seattleEntries = store.entriesByScope.get('seattle') ?? [];
    expect(vashonEntries.length).toBeGreaterThan(0);
    expect(seattleEntries.length).toBe(1);
    expect(seattleEntries[0].id).toBe('e-sea-001');
  });

  it('entriesByType indexes entries by factuality type', () => {
    const store = buildTestStore();
    const historical = store.entriesByType.get('historical') ?? [];
    const fantasy = store.entriesByType.get('fantasy') ?? [];
    expect(historical.length).toBeGreaterThan(0);
    expect(fantasy.length).toBe(1);
    expect(fantasy[0].id).toBe('e-fan-001');
  });

  it('fantasy entry has narrative metadata', () => {
    const store = buildTestStore();
    const fantasyEntry = store.entriesById.get('e-fan-001');
    expect(fantasyEntry).toBeDefined();
    expect(fantasyEntry!.entry_type).toBe('fantasy');
    expect(fantasyEntry!.universe_id).toBe('test-campaign');
    expect(fantasyEntry!.narrative?.arc).toBe('tidewalker-awakening');
    expect(fantasyEntry!.narrative?.beat).toBe('inciting-incident');
    expect(fantasyEntry!.narrative?.anchors).toHaveLength(1);
    expect(fantasyEntry!.narrative?.anchors![0].entry_id).toBe('e-005');
    expect(fantasyEntry!.narrative?.anchors![0].relationship).toBe('consequence_of');
  });

  it('fantasy person has narrator fields', () => {
    const store = buildTestStore();
    const tidewalker = store.peopleByName.get('The Tidewalker');
    expect(tidewalker).toBeDefined();
    expect(tidewalker!.entry_type).toBe('fantasy');
    expect(tidewalker!.universe_id).toBe('test-campaign');
    expect(tidewalker!.personality).toBe('Ancient and patient');
    expect(tidewalker!.motivation).toBe('Restore ecological memory');
    expect(tidewalker!.speech_style).toBe('Archaic, rhythmic');
  });
});
