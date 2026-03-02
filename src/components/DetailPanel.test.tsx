/**
 * Unit tests for DetailPanel component
 * Covers: UT-C001 (full entry rendering in detail), cross-reference links
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DetailPanel from './DetailPanel';
import { buildTestStore, TEST_ENTRIES } from '../__fixtures__/test-data';
import type { DataStore } from '../types';

describe('DetailPanel', () => {
  let store: DataStore;

  beforeEach(() => {
    store = buildTestStore();
  });

  const entry = TEST_ENTRIES[0]; // Pioneer Settlement Founded

  it('renders entry title', () => {
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);
    expect(screen.getByText('Pioneer Settlement Founded')).toBeInTheDocument();
  });

  it('renders date range', () => {
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);
    expect(screen.getByText(/1870/)).toBeInTheDocument();
    expect(screen.getByText(/1875/)).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);
    expect(screen.getByText('The first pioneer settlement was founded.')).toBeInTheDocument();
  });

  it('renders extended details when present', () => {
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);
    expect(screen.getByText('Extended details about the settlement founding.')).toBeInTheDocument();
  });

  it('renders related people from DataStore', () => {
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);
    expect(screen.getByText('Alice Pioneer')).toBeInTheDocument();
    expect(screen.getByText('homesteader')).toBeInTheDocument();
  });

  it('renders related places from DataStore', () => {
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);
    expect(screen.getByText('Test Landing')).toBeInTheDocument();
    expect(screen.getByText('landmark')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);
    expect(screen.getByText('settlement')).toBeInTheDocument();
    expect(screen.getByText('founding')).toBeInTheDocument();
  });

  it('renders sources', () => {
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);
    expect(screen.getByText('Settlement Records')).toBeInTheDocument();
  });

  it('renders layer badges', () => {
    const { container } = render(
      <DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />
    );
    const badges = container.querySelectorAll('.panel-layer-badge');
    expect(badges.length).toBe(entry.layers.length);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<DetailPanel entry={entry} data={store} onClose={onClose} onEntrySelect={() => {}} />);

    fireEvent.click(screen.getByLabelText('Close detail panel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders cross-reference links for people with multiple entries', () => {
    // Alice Pioneer has related_entries: ['e-001', 'e-002']
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);

    // Should show link to 'Logging Operation Begins' (e-002) since we're viewing e-001
    expect(screen.getByText('Logging Operation Begins')).toBeInTheDocument();
  });

  it('calls onEntrySelect when cross-reference link is clicked', () => {
    const onEntrySelect = vi.fn();
    render(<DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={onEntrySelect} />);

    fireEvent.click(screen.getByText('Logging Operation Begins'));
    expect(onEntrySelect).toHaveBeenCalledWith('e-002');
  });

  it('renders minimal entry without errors', () => {
    const minEntry = TEST_ENTRIES[6]; // Minimal Entry
    render(<DetailPanel entry={minEntry} data={store} onClose={() => {}} onEntrySelect={() => {}} />);

    expect(screen.getByText('Minimal Entry')).toBeInTheDocument();
    // Should not have People, Places, Tags, or Sources sections
    expect(screen.queryByText('People')).not.toBeInTheDocument();
    expect(screen.queryByText('Places')).not.toBeInTheDocument();
  });

  it('has complementary role for accessibility', () => {
    const { container } = render(
      <DetailPanel entry={entry} data={store} onClose={() => {}} onEntrySelect={() => {}} />
    );
    expect(container.querySelector('[role="complementary"]')).toBeInTheDocument();
  });
});
