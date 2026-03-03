/**
 * Tests for creative entry visual treatment in EntryCard
 * Covers: M8 visual distinction — dashed borders, type badges, diamond dots, scope badges
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EntryCard from './EntryCard';
import { TEST_ENTRIES } from '../__fixtures__/test-data';

describe('EntryCard — creative entries', () => {
  const fantasyEntry = TEST_ENTRIES.find((e) => e.id === 'e-fan-001')!;
  const historicalEntry = TEST_ENTRIES[0]; // Pioneer Settlement Founded
  const seattleEntry = TEST_ENTRIES.find((e) => e.id === 'e-sea-001')!;

  it('applies creative class to fantasy entries', () => {
    const { container } = render(<EntryCard entry={fantasyEntry} isSelected={false} onClick={() => {}} />);

    const card = container.querySelector('.entry-card');
    expect(card?.classList.contains('creative')).toBe(true);
  });

  it('does not apply creative class to historical entries', () => {
    const { container } = render(<EntryCard entry={historicalEntry} isSelected={false} onClick={() => {}} />);

    const card = container.querySelector('.entry-card');
    expect(card?.classList.contains('creative')).toBe(false);
  });

  it('renders entry type badge for fantasy entries', () => {
    render(<EntryCard entry={fantasyEntry} isSelected={false} onClick={() => {}} />);

    expect(screen.getByText('Fantasy')).toBeInTheDocument();
  });

  it('does not render entry type badge for historical entries', () => {
    render(<EntryCard entry={historicalEntry} isSelected={false} onClick={() => {}} />);

    expect(screen.queryByText('Historical')).not.toBeInTheDocument();
    expect(screen.queryByText('Fantasy')).not.toBeInTheDocument();
  });

  it('renders diamond-shaped dots for creative entries', () => {
    const { container } = render(<EntryCard entry={fantasyEntry} isSelected={false} onClick={() => {}} />);

    const dots = container.querySelectorAll('.layer-dot.creative');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('renders scope badge for non-vashon entries', () => {
    render(<EntryCard entry={seattleEntry} isSelected={false} onClick={() => {}} />);

    expect(screen.getByText('Seattle')).toBeInTheDocument();
  });

  it('does not render scope badge for vashon entries', () => {
    render(<EntryCard entry={historicalEntry} isSelected={false} onClick={() => {}} />);

    expect(screen.queryByText('Vashon Island')).not.toBeInTheDocument();
  });

  it('sets data-entry-type attribute', () => {
    const { container } = render(<EntryCard entry={fantasyEntry} isSelected={false} onClick={() => {}} />);

    const card = container.querySelector('.entry-card');
    expect(card?.getAttribute('data-entry-type')).toBe('fantasy');
  });

  it('includes entry type in aria-label for creative entries', () => {
    render(<EntryCard entry={fantasyEntry} isSelected={false} onClick={() => {}} />);

    const card = screen.getByRole('button');
    expect(card.getAttribute('aria-label')).toContain('fantasy');
  });

  it('applies speculative class to speculative entries', () => {
    const specEntry = { ...historicalEntry, entry_type: 'speculative' as const };
    const { container } = render(<EntryCard entry={specEntry} isSelected={false} onClick={() => {}} />);

    const card = container.querySelector('.entry-card');
    expect(card?.classList.contains('speculative')).toBe(true);
    expect(card?.classList.contains('creative')).toBe(true);
  });
});
