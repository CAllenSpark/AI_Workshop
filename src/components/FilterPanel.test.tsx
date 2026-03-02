/**
 * Unit tests for FilterPanel component
 * Covers: UT-C003 (filter chip toggle), layer toggles, era chips
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';
import type { LayerKey, EraKey } from '../types';

function renderFilterPanel(overrides: Partial<Parameters<typeof FilterPanel>[0]> = {}) {
  const defaultProps = {
    activeLayers: new Set<LayerKey>(['event', 'person', 'place', 'environment']),
    selectedEras: new Set<EraKey>(),
    dateRange: [-15000, 2026] as [number, number],
    fullDateRange: [-15000, 2026] as [number, number],
    totalCount: 20,
    filteredCount: 20,
    onLayerToggle: vi.fn(),
    onEraToggle: vi.fn(),
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
});
