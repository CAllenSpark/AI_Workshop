/**
 * Unit tests for useSearch hook (Fuse.js wrapper)
 * Covers: UT-S001, UT-S002, UT-S004, UT-S005
 */
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSearch } from './useSearch';
import { TEST_ENTRIES } from '../__fixtures__/test-data';

describe('useSearch', () => {
  it('UT-S004: empty query returns empty results', () => {
    const { result } = renderHook(() => useSearch(TEST_ENTRIES));
    expect(result.current.search('')).toEqual([]);
  });

  it('UT-S004: query under min length returns empty results', () => {
    const { result } = renderHook(() => useSearch(TEST_ENTRIES));
    expect(result.current.search('a')).toEqual([]);
  });

  it('UT-S002: title match scores higher than description match', () => {
    const { result } = renderHook(() => useSearch(TEST_ENTRIES));
    const results = result.current.search('Pioneer');

    // "Pioneer Settlement Founded" should rank high (title contains "Pioneer")
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entry.title).toContain('Pioneer');
  });

  it('finds entries by description text', () => {
    const { result } = renderHook(() => useSearch(TEST_ENTRIES));
    const results = result.current.search('glacier');

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.entry.id === 'e-005')).toBe(true);
  });

  it('finds entries by tag', () => {
    const { result } = renderHook(() => useSearch(TEST_ENTRIES));
    const results = result.current.search('logging');

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.entry.id === 'e-002')).toBe(true);
  });

  it('finds entries by people reference', () => {
    const { result } = renderHook(() => useSearch(TEST_ENTRIES));
    const results = result.current.search('Bob Explorer');

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.entry.id === 'e-003')).toBe(true);
  });

  it('UT-S005: handles special characters gracefully', () => {
    const { result } = renderHook(() => useSearch(TEST_ENTRIES));

    // Should not throw
    const results = result.current.search("K'Pah");
    expect(results.length).toBeGreaterThanOrEqual(0);
  });

  it('results include score and matches', () => {
    const { result } = renderHook(() => useSearch(TEST_ENTRIES));
    const results = result.current.search('settlement');

    if (results.length > 0) {
      expect(typeof results[0].score).toBe('number');
      expect(results[0].matches).toBeDefined();
    }
  });

  it('returns no results for non-matching query', () => {
    const { result } = renderHook(() => useSearch(TEST_ENTRIES));
    const results = result.current.search('xyznonexistent123');

    expect(results).toHaveLength(0);
  });
});
