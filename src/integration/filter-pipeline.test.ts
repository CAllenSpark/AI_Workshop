/**
 * Integration tests for filter pipeline: data load -> search -> filter
 * Covers: IT-001, IT-003, IT-006
 */
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSearch } from '../hooks/useSearch';
import { buildTestStore } from '../__fixtures__/test-data';
import type { LayerKey, EraKey, TimelineEntry } from '../types';

/**
 * Simulates the App's combined filter logic:
 * 1. Search (optional)
 * 2. Layer filter
 * 3. Era filter
 * 4. Date range filter
 */
function applyFilters(
  entries: TimelineEntry[],
  options: {
    searchQuery?: string;
    searchFn?: (q: string) => { entry: TimelineEntry }[];
    activeLayers?: Set<LayerKey>;
    selectedEras?: Set<EraKey>;
    dateRange?: [number, number];
    parsedDates?: Map<string, number>;
  }
): TimelineEntry[] {
  let result = entries;

  // 1. Search
  if (options.searchQuery && options.searchQuery.length >= 2 && options.searchFn) {
    result = options.searchFn(options.searchQuery).map((r) => r.entry);
  }

  // 2. Layer filter
  if (options.activeLayers) {
    result = result.filter((e) =>
      e.layers.some((l) => options.activeLayers!.has(l as LayerKey))
    );
  }

  // 3. Era filter
  if (options.selectedEras && options.selectedEras.size > 0) {
    result = result.filter((e) => options.selectedEras!.has(e.era));
  }

  // 4. Date range filter
  if (options.dateRange && options.parsedDates) {
    result = result.filter((e) => {
      const year = options.parsedDates!.get(e.id) ?? 0;
      return year >= options.dateRange![0] && year <= options.dateRange![1];
    });
  }

  return result;
}

describe('Filter Pipeline Integration', () => {
  const store = buildTestStore();

  it('IT-001: data load -> search -> filter pipeline produces correct results', () => {
    const { result } = renderHook(() => useSearch(store.entries));

    const filtered = applyFilters(store.entries, {
      searchQuery: 'Pioneer',
      searchFn: result.current.search,
      activeLayers: new Set<LayerKey>(['event', 'person', 'place', 'environment']),
      parsedDates: store.parsedDates,
      dateRange: [-15000, 2026],
    });

    // Should find entries related to Pioneer
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((e) =>
      e.title.includes('Pioneer') ||
      e.people.some((p) => p.includes('Pioneer')) ||
      e.description.includes('pioneer')
    )).toBe(true);
  });

  it('IT-003: toggling off "person" layer hides person entries', () => {
    const withoutPerson = applyFilters(store.entries, {
      activeLayers: new Set<LayerKey>(['event', 'place', 'environment']),
      parsedDates: store.parsedDates,
      dateRange: [-15000, 2026],
    });

    // Entries that ONLY have the 'person' layer should be excluded
    // Entries that have 'person' AND another active layer should still be included
    for (const entry of withoutPerson) {
      // At least one layer must be in the active set
      expect(entry.layers.some((l) => ['event', 'place', 'environment'].includes(l))).toBe(true);
    }
  });

  it('IT-003: toggling off "environment" layer excludes environment-only entries', () => {
    const withoutEnv = applyFilters(store.entries, {
      activeLayers: new Set<LayerKey>(['event', 'person', 'place']),
      parsedDates: store.parsedDates,
      dateRange: [-15000, 2026],
    });

    // e-005 (Glacial Retreat) is environment-only, should be excluded
    expect(withoutEnv.some((e) => e.id === 'e-005')).toBe(false);
  });

  it('IT-006: sequential era + layer filter produces intersection', () => {
    // First apply era filter for 'pioneer'
    const eraFiltered = applyFilters(store.entries, {
      activeLayers: new Set<LayerKey>(['event', 'person', 'place', 'environment']),
      selectedEras: new Set<EraKey>(['pioneer']),
      parsedDates: store.parsedDates,
      dateRange: [-15000, 2026],
    });

    expect(eraFiltered.every((e) => e.era === 'pioneer')).toBe(true);
    expect(eraFiltered.length).toBeGreaterThan(0);

    // Now also filter by layer 'event' only
    const bothFiltered = applyFilters(store.entries, {
      activeLayers: new Set<LayerKey>(['event']),
      selectedEras: new Set<EraKey>(['pioneer']),
      parsedDates: store.parsedDates,
      dateRange: [-15000, 2026],
    });

    expect(bothFiltered.every((e) => e.era === 'pioneer')).toBe(true);
    expect(bothFiltered.every((e) => e.layers.includes('event'))).toBe(true);
    expect(bothFiltered.length).toBeLessThanOrEqual(eraFiltered.length);
  });

  it('IT-006: date range restricts results to visible window', () => {
    const filtered = applyFilters(store.entries, {
      activeLayers: new Set<LayerKey>(['event', 'person', 'place', 'environment']),
      parsedDates: store.parsedDates,
      dateRange: [1800, 1900],
    });

    for (const entry of filtered) {
      const year = store.parsedDates.get(entry.id) ?? 0;
      expect(year).toBeGreaterThanOrEqual(1800);
      expect(year).toBeLessThanOrEqual(1900);
    }
  });

  it('no results when all layers are toggled off', () => {
    const filtered = applyFilters(store.entries, {
      activeLayers: new Set<LayerKey>(),
      parsedDates: store.parsedDates,
      dateRange: [-15000, 2026],
    });

    expect(filtered).toHaveLength(0);
  });

  it('no results when date range excludes all entries', () => {
    const filtered = applyFilters(store.entries, {
      activeLayers: new Set<LayerKey>(['event', 'person', 'place', 'environment']),
      parsedDates: store.parsedDates,
      dateRange: [3000, 4000],
    });

    expect(filtered).toHaveLength(0);
  });

  it('all entries returned with no filters applied', () => {
    const filtered = applyFilters(store.entries, {
      activeLayers: new Set<LayerKey>(['event', 'person', 'place', 'environment']),
      parsedDates: store.parsedDates,
      dateRange: [-15000, 2026],
    });

    expect(filtered.length).toBe(store.entries.length);
  });
});
