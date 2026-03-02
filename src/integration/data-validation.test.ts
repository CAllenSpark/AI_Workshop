/**
 * Integration tests for data validation
 * Covers: DV-004 (date ordering), DV-005 (orphaned refs), DV-007 (required fields), DV-008 (unique IDs)
 */
import { describe, it, expect } from 'vitest';
import { buildTestStore, TEST_ENTRIES, TEST_PEOPLE, TEST_PLACES } from '../__fixtures__/test-data';
import { parseDate } from '../data/loader';

describe('Data Validation', () => {
  const store = buildTestStore();

  it('DV-008: all entry IDs are globally unique', () => {
    const ids = TEST_ENTRIES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('DV-008: all people IDs are unique', () => {
    const ids = TEST_PEOPLE.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('DV-008: all place IDs are unique', () => {
    const ids = TEST_PLACES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('DV-007: every entry has a non-empty title', () => {
    for (const entry of TEST_ENTRIES) {
      expect(entry.title).toBeTruthy();
    }
  });

  it('DV-007: every entry has a non-empty description', () => {
    for (const entry of TEST_ENTRIES) {
      expect(entry.description).toBeTruthy();
    }
  });

  it('DV-007: every entry has a non-empty era', () => {
    for (const entry of TEST_ENTRIES) {
      expect(entry.era).toBeTruthy();
    }
  });

  it('DV-007: every entry has at least one layer', () => {
    for (const entry of TEST_ENTRIES) {
      expect(entry.layers.length).toBeGreaterThan(0);
    }
  });

  it('DV-004: date_start parses to a valid number for all entries', () => {
    for (const entry of TEST_ENTRIES) {
      const year = parseDate(entry.date_start);
      expect(typeof year).toBe('number');
      // All our test dates should parse to non-zero
      expect(year).not.toBe(0);
    }
  });

  it('DV-004: entries with date_end have end >= start', () => {
    for (const entry of TEST_ENTRIES) {
      if (entry.date_end) {
        const start = parseDate(entry.date_start);
        const end = parseDate(entry.date_end);
        expect(end).toBeGreaterThanOrEqual(start);
      }
    }
  });

  it('DV-005: people referenced by entries exist in people dataset', () => {
    const peopleNames = new Set(TEST_PEOPLE.map((p) => p.name));
    for (const entry of TEST_ENTRIES) {
      for (const personName of entry.people) {
        expect(peopleNames.has(personName)).toBe(true);
      }
    }
  });

  it('DV-005: places referenced by entries exist in places dataset', () => {
    const placeNames = new Set(TEST_PLACES.map((p) => p.name));
    for (const entry of TEST_ENTRIES) {
      for (const placeName of entry.places) {
        expect(placeNames.has(placeName)).toBe(true);
      }
    }
  });

  it('DV-005: person related_entries reference existing entry IDs', () => {
    const entryIds = new Set(TEST_ENTRIES.map((e) => e.id));
    for (const person of TEST_PEOPLE) {
      if (person.related_entries) {
        for (const eid of person.related_entries) {
          expect(entryIds.has(eid)).toBe(true);
        }
      }
    }
  });

  it('DV-005: detects orphaned person (not referenced by any entry)', () => {
    // 'Orphan Person' (p-004) is not referenced by any entry
    const orphan = TEST_PEOPLE.find((p) => p.id === 'p-004');
    expect(orphan).toBeDefined();
    expect(orphan!.name).toBe('Orphan Person');

    const isReferenced = TEST_ENTRIES.some((e) => e.people.includes(orphan!.name));
    expect(isReferenced).toBe(false);
  });

  it('store.parsedDates has correct values', () => {
    // e-001: '1870' -> 1870
    expect(store.parsedDates.get('e-001')).toBe(1870);
    // e-004: '~10000 BCE' -> -10000
    expect(store.parsedDates.get('e-004')).toBe(-10000);
    // e-005: '~15000 BCE' -> -15000
    expect(store.parsedDates.get('e-005')).toBe(-15000);
    // e-003: '1792-05-20' -> 1792
    expect(store.parsedDates.get('e-003')).toBe(1792);
  });

  it('all eras in entries are valid era keys', () => {
    const validEras = new Set([
      'prehistory', 'indigenous', 'exploration', 'logging-treaty', 'pioneer',
      'growth-industry', 'early-20th-century', 'wwii', 'state-ferry', 'modern',
    ]);
    for (const entry of TEST_ENTRIES) {
      expect(validEras.has(entry.era)).toBe(true);
    }
  });

  it('all layers in entries are valid layer keys', () => {
    const validLayers = new Set(['event', 'person', 'place', 'environment']);
    for (const entry of TEST_ENTRIES) {
      for (const layer of entry.layers) {
        expect(validLayers.has(layer)).toBe(true);
      }
    }
  });
});
