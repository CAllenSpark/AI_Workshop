/**
 * Unit tests for FilterPanel component
 * Covers: UT-C003 (filter chip toggle), layer toggles, era chips
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';
import type { LayerKey, EraKey, ScopeKey } from '../types';

function renderFilterPanel(overrides: Partial<Parameters<typeof FilterPanel>[0]> = {}) {
  const defaultProps = {
    activeLayers: new Set<LayerKey>(['event', 'person', 'place', 'environment']),
    selectedEras: new Set<EraKey>(),
    activeScopes: new Set<ScopeKey>(['vashon', 'seattle', 'tacoma', 'national']),
    dateRange: [-15000, 2026] as [number, number],
    fullDateRange: [-15000, 2026] as [number, number],
    totalCount: 20,
    filteredCount: 20,
    viewMode: 'all' as const,
    onLayerToggle: vi.fn(),
    onEraToggle: vi.fn(),
    onScopeToggle: vi.fn(),
    onDateRangeChange: vi.fn(),
    onClearAll: vi.fn(),
    ...overrides,
  };

  return { ...render(<FilterPanel {...defaultProps} />), props: defaultProps };
}

describe('FilterPanel', () => {
  it('renders all 4 layer toggles', () => {
    renderFilterPanel();
    expect(screen.getByText('Event')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Place')).toBeInTheDocument();
    expect(screen.getByText('Environment')).toBeInTheDocument();
  });

  it('renders all era chips', () => {
    renderFilterPanel();
    expect(screen.getByText('Prehistory')).toBeInTheDocument();
    expect(screen.getByText('Pioneer Settlement')).toBeInTheDocument();
    expect(screen.getByText('Modern Era')).toBeInTheDocument();
  });

  it('UT-C003: layer toggle calls onLayerToggle with the correct key', () => {
    const { props } = renderFilterPanel();

    fireEvent.click(screen.getByText('Event'));
    expect(props.onLayerToggle).toHaveBeenCalledWith('event');
  });

  it('UT-C003: layer toggle has aria-pressed=true when active', () => {
    renderFilterPanel({ activeLayers: new Set<LayerKey>(['event']) });

    const eventBtn = screen.getByText('Event').closest('button');
    expect(eventBtn).toHaveAttribute('aria-pressed', 'true');

    const personBtn = screen.getByText('People').closest('button');
    expect(personBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('era chip calls onEraToggle with the correct key', () => {
    const { props } = renderFilterPanel();

    fireEvent.click(screen.getByText('Pioneer Settlement'));
    expect(props.onEraToggle).toHaveBeenCalledWith('pioneer');
  });

  it('era chip has aria-pressed=true when selected', () => {
    renderFilterPanel({ selectedEras: new Set<EraKey>(['pioneer']) });

    const chip = screen.getByText('Pioneer Settlement').closest('button');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('displays "Showing X of Y entries"', () => {
    renderFilterPanel({ totalCount: 50, filteredCount: 12 });

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText(/of 50 entries/)).toBeInTheDocument();
  });

  it('shows Clear All Filters when filters are active', () => {
    renderFilterPanel({
      activeLayers: new Set<LayerKey>(['event']), // Only 1 layer = active filter
    });

    expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
  });

  it('hides Clear All Filters when no filters are active', () => {
    renderFilterPanel();

    expect(screen.queryByText('Clear All Filters')).not.toBeInTheDocument();
  });

  it('calls onClearAll when Clear All Filters is clicked', () => {
    const { props } = renderFilterPanel({
      activeLayers: new Set<LayerKey>(['event']),
    });

    fireEvent.click(screen.getByText('Clear All Filters'));
    expect(props.onClearAll).toHaveBeenCalledOnce();
  });

  it('renders date range sliders with proper labels', () => {
    renderFilterPanel();

    expect(screen.getByLabelText('Start date')).toBeInTheDocument();
    expect(screen.getByLabelText('End date')).toBeInTheDocument();
  });

  it('shows selected era count', () => {
    renderFilterPanel({
      selectedEras: new Set<EraKey>(['pioneer', 'modern']),
    });

    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  // Scope filter tests (M9)
  it('renders all 4 scope toggles', () => {
    renderFilterPanel();
    expect(screen.getByText('Vashon Island')).toBeInTheDocument();
    expect(screen.getByText('Seattle')).toBeInTheDocument();
    expect(screen.getByText('Tacoma')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  it('scope toggle calls onScopeToggle with correct key', () => {
    const { props } = renderFilterPanel();
    fireEvent.click(screen.getByText('Seattle'));
    expect(props.onScopeToggle).toHaveBeenCalledWith('seattle');
  });

  it('scope toggle has aria-pressed=true when active', () => {
    renderFilterPanel({ activeScopes: new Set<ScopeKey>(['vashon']) });

    const vashonBtn = screen.getByText('Vashon Island').closest('button');
    expect(vashonBtn).toHaveAttribute('aria-pressed', 'true');

    const seattleBtn = screen.getByText('Seattle').closest('button');
    expect(seattleBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows scope count when not all are active', () => {
    renderFilterPanel({ activeScopes: new Set<ScopeKey>(['vashon', 'seattle']) });
    expect(screen.getByText('2 of 4')).toBeInTheDocument();
  });

  it('shows Clear All Filters when scopes are filtered', () => {
    renderFilterPanel({ activeScopes: new Set<ScopeKey>(['vashon']) });
    expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
  });

  // View mode indicator tests (M9)
  it('shows view mode indicator when not in "all" mode', () => {
    renderFilterPanel({ viewMode: 'historical' });
    expect(screen.getByText('Historical entries only')).toBeInTheDocument();
  });

  it('shows creative mode indicator', () => {
    renderFilterPanel({ viewMode: 'creative' });
    expect(screen.getByText('Creative entries only')).toBeInTheDocument();
  });

  it('does not show view mode indicator in "all" mode', () => {
    renderFilterPanel({ viewMode: 'all' });
    expect(screen.queryByText('Historical entries only')).not.toBeInTheDocument();
    expect(screen.queryByText('Creative entries only')).not.toBeInTheDocument();
  });
});
