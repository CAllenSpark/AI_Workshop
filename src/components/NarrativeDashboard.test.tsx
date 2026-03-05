/**
 * Unit tests for NarrativeDashboard component
 * Covers: M9 narrative dashboard, stats, arc display, anchors, empty state
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NarrativeDashboard from './NarrativeDashboard';
import { buildTestStore } from '../__fixtures__/test-data';
import type { DataStore } from '../types';

function renderDashboard(overrides: { data?: DataStore; viewMode?: 'all' | 'historical' | 'creative'; books?: import('../types').Book[] } = {}) {
  const defaultProps = {
    data: buildTestStore(),
    viewMode: 'all' as const,
    books: [] as import('../types').Book[],
    onEntrySelect: vi.fn(),
    ...overrides,
  };

  return { ...render(<NarrativeDashboard {...defaultProps} />), props: defaultProps };
}

describe('NarrativeDashboard', () => {
  it('renders the dashboard header', () => {
    renderDashboard();
    expect(screen.getByText('Narrative Dashboard')).toBeInTheDocument();
  });

  it('renders stats cards', () => {
    renderDashboard();
    expect(screen.getByText('Historical')).toBeInTheDocument();
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
    expect(screen.getByText('Speculative')).toBeInTheDocument();
    expect(screen.getByText('Anchors')).toBeInTheDocument();
    expect(screen.getByText('Arcs')).toBeInTheDocument();
  });

  it('shows correct fantasy count', () => {
    renderDashboard();
    // Test data has 1 fantasy entry (e-fan-001)
    const fantasyCard = screen.getByText('Fantasy').closest('.stat-card');
    expect(fantasyCard).toBeInTheDocument();
    const number = fantasyCard?.querySelector('.stat-number');
    expect(number?.textContent).toBe('1');
  });

  it('shows arc breakdown with arc name', () => {
    renderDashboard();
    // Test data has arc 'tidewalker-awakening'
    expect(screen.getByText('tidewalker-awakening')).toBeInTheDocument();
  });

  it('shows arc entry count', () => {
    renderDashboard();
    expect(screen.getByText('1 entries')).toBeInTheDocument();
  });

  it('shows entry title in arc section', () => {
    renderDashboard();
    const titles = screen.getAllByText('The Tidewalker Emerges');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('shows beat label for entries with narrative beat', () => {
    renderDashboard();
    expect(screen.getByText('Inciting Incident')).toBeInTheDocument();
  });

  it('clicking an arc entry calls onEntrySelect', () => {
    const { props, container } = renderDashboard();
    const arcEntryLink = container.querySelector('.arc-entry-link')!;
    fireEvent.click(arcEntryLink);
    expect(props.onEntrySelect).toHaveBeenCalledWith('e-fan-001');
  });

  it('shows historical connections section when anchors exist', () => {
    renderDashboard();
    expect(screen.getByText('Historical Connections')).toBeInTheDocument();
  });

  it('shows anchor relationship text', () => {
    renderDashboard();
    expect(screen.getByText('consequence of')).toBeInTheDocument();
  });

  it('clicking an anchor target calls onEntrySelect', () => {
    const { props } = renderDashboard();
    // The anchor target is 'Glacial Retreat' (entry e-005)
    fireEvent.click(screen.getByText('Glacial Retreat'));
    expect(props.onEntrySelect).toHaveBeenCalledWith('e-005');
  });

  it('shows empty state when no creative entries exist', () => {
    const data = buildTestStore();
    // Remove all creative entries
    const historicalOnly: DataStore = {
      ...data,
      entries: data.entries.filter(e => (e.entry_type ?? 'historical') === 'historical'),
    };
    renderDashboard({ data: historicalOnly });

    expect(screen.getByText(/No creative entries yet/)).toBeInTheDocument();
  });

  it('renders beat segments in beat track', () => {
    const { container } = renderDashboard();
    const beatSegments = container.querySelectorAll('.beat-segment');
    // 9 beats in BEAT_ORDER
    expect(beatSegments.length).toBe(9);
  });

  it('marks inciting-incident beat as filled', () => {
    const { container } = renderDashboard();
    const filledSegments = container.querySelectorAll('.beat-segment.filled');
    expect(filledSegments.length).toBeGreaterThan(0);
  });
});
