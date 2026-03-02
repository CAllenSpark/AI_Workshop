/**
 * Unit tests for era definitions and lookup
 * Covers: UT-T001 (era from date), era boundary validation
 */
import { describe, it, expect } from 'vitest';
import { ERAS, getEra, LAYER_COLORS } from './eras';

describe('ERAS', () => {
  it('contains all 10 defined eras', () => {
    expect(ERAS).toHaveLength(10);
  });

  it('has unique keys', () => {
    const keys = ERAS.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('every era has required fields', () => {
    for (const era of ERAS) {
      expect(era.key).toBeTruthy();
      expect(era.name).toBeTruthy();
      expect(typeof era.start).toBe('number');
      expect(typeof era.end).toBe('number');
      expect(era.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(era.colorLight).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('era boundaries are ordered (start <= end)', () => {
    for (const era of ERAS) {
      expect(era.start).toBeLessThanOrEqual(era.end);
    }
  });
});

describe('getEra', () => {
  it('UT-T001: returns the correct era for a valid key', () => {
    const pioneer = getEra('pioneer');
    expect(pioneer).toBeDefined();
    expect(pioneer!.name).toBe('Pioneer Settlement');
    expect(pioneer!.start).toBe(1865);
    expect(pioneer!.end).toBe(1900);
  });

  it('returns undefined for invalid key', () => {
    // @ts-expect-error testing invalid key
    expect(getEra('nonexistent')).toBeUndefined();
  });

  it('returns prehistory era', () => {
    const era = getEra('prehistory');
    expect(era).toBeDefined();
    expect(era!.start).toBe(-15000);
  });

  it('returns modern era', () => {
    const era = getEra('modern');
    expect(era).toBeDefined();
    expect(era!.end).toBe(2026);
  });
});

describe('LAYER_COLORS', () => {
  it('defines all 4 layer types', () => {
    expect(Object.keys(LAYER_COLORS)).toEqual(
      expect.arrayContaining(['event', 'person', 'place', 'environment'])
    );
  });

  it('each layer has color, bg, and label', () => {
    for (const [, lc] of Object.entries(LAYER_COLORS)) {
      expect(lc.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(lc.bg).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(lc.label).toBeTruthy();
    }
  });
});
