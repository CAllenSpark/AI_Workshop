import { useState, useCallback, useEffect, useMemo } from 'react';
import type { TimelineEntry, LayerKey, EraKey, ZoomLevel } from './types';
import { useTimelineData } from './hooks/useTimelineData';
import { useSearch } from './hooks/useSearch';
import { parseDate } from './data/loader';
import TimelineTrack from './components/TimelineTrack';
import EntryCard from './components/EntryCard';
import DetailPanel from './components/DetailPanel';
import FilterPanel from './components/FilterPanel';
import ExportDialog from './components/ExportDialog';
import KeyboardHelp from './components/KeyboardHelp';
import './App.css';

const ALL_LAYERS = new Set<LayerKey>(['event', 'person', 'place', 'environment']);

export default function App() {
  const { data, loading, error } = useTimelineData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(new Set(ALL_LAYERS));
  const [selectedEras, setSelectedEras] = useState<Set<EraKey>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Compute the full date range from data
  const fullDateRange = useMemo<[number, number]>(() => {
    if (!data || data.entries.length === 0) return [-15000, 2026];
    const years = data.entries.map((e) => parseDate(e.date_start));
    return [Math.min(...years), Math.max(...years)];
  }, [data]);

  const [dateRange, setDateRange] = useState<[number, number]>(fullDateRange);

  // Sync dateRange with fullDateRange when data first loads
  useEffect(() => {
    setDateRange(fullDateRange);
  }, [fullDateRange]);

  // Initialize Fuse.js search
  const { search } = useSearch(data?.entries ?? []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;

      if (e.key === 'Escape') {
        if (showExport) { setShowExport(false); return; }
        if (showHelp) { setShowHelp(false); return; }
        setSelectedId(null);
      }
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
      }
      if ((e.key === 'e' || e.key === 'E') && !isInput && !showExport && !showHelp) {
        e.preventDefault();
        setShowExport(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showExport, showHelp]);

  const handleEntrySelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const toggleLayer = useCallback((layer: LayerKey) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }, []);

  const toggleEra = useCallback((era: EraKey) => {
    setSelectedEras((prev) => {
      const next = new Set(prev);
      if (next.has(era)) next.delete(era);
      else next.add(era);
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveLayers(new Set(ALL_LAYERS));
    setSelectedEras(new Set());
    setDateRange(fullDateRange);
    setSearchQuery('');
  }, [fullDateRange]);

  // Combined AND filter: search + layers + eras + date range
  const filteredEntries = useMemo(() => {
    if (!data) return [];

    // Start with search results or all entries
    let result: TimelineEntry[];
    if (searchQuery.trim().length >= 2) {
      const searchResults = search(searchQuery);
      result = searchResults.map((r) => r.entry);
    } else {
      result = data.entries;
    }

    // Filter by active layers
    result = result.filter((e) =>
      e.layers.some((l) => activeLayers.has(l as LayerKey))
    );

    // Filter by selected eras (if any selected; empty = show all)
    if (selectedEras.size > 0) {
      result = result.filter((e) => selectedEras.has(e.era));
    }

    // Filter by date range
    result = result.filter((e) => {
      const year = parseDate(e.date_start);
      return year >= dateRange[0] && year <= dateRange[1];
    });

    return result;
  }, [data, searchQuery, search, activeLayers, selectedEras, dateRange]);

  const selectedEntry = useMemo<TimelineEntry | null>(
    () => data?.entries.find((e) => e.id === selectedId) ?? null,
    [data, selectedId]
  );

  if (loading) {
    return (
      <div className="app-loading" role="status">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading Vashon Island knowledge base...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-error" role="alert">
        <h2>Failed to load data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`app ${selectedEntry ? 'panel-open' : ''}`}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1>Writer's Research Companion</h1>
          <span className="header-setting">Vashon Island, WA</span>
        </div>
        <div className="header-center">
          <input
            id="search-input"
            type="search"
            className="search-input"
            placeholder="Search entries, people, places... (press /)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search the knowledge base"
          />
          {searchQuery && (
            <span className="search-count" aria-live="polite">{filteredEntries.length} results</span>
          )}
        </div>
        <div className="header-right">
          <button
            className="export-btn"
            onClick={() => setShowExport(true)}
            aria-label="Export knowledge base"
            title="Export (E)"
          >
            Export
          </button>
          <button
            className="help-btn"
            onClick={() => setShowHelp(true)}
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            ?
          </button>
          <span className="entry-count">{filteredEntries.length} / {data.entries.length} entries</span>
        </div>
      </header>

      {/* Filter panel with layer toggles, era chips, date range */}
      <nav aria-label="Filters">
        <FilterPanel
          activeLayers={activeLayers}
          selectedEras={selectedEras}
          dateRange={dateRange}
          fullDateRange={fullDateRange}
          totalCount={data.entries.length}
          filteredCount={filteredEntries.length}
          onLayerToggle={toggleLayer}
          onEraToggle={toggleEra}
          onDateRangeChange={setDateRange}
          onClearAll={handleClearAll}
        />
      </nav>

      {/* Live region for filter count announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing {filteredEntries.length} of {data.entries.length} entries
      </div>

      {/* Timeline and entries */}
      <main id="main-content" className="app-main">
        <TimelineTrack
          entries={data.entries}
          zoomLevel={zoomLevel}
          activeLayers={activeLayers}
          selectedEntryId={selectedId}
          onEntrySelect={handleEntrySelect}
          onZoomChange={setZoomLevel}
        />

        {/* Entry list */}
        <div className="entry-list" role="list" aria-label="Timeline entries">
          {filteredEntries.length === 0 ? (
            <div className="empty-state" role="status">
              <p>No entries match your current filters.</p>
              <button className="clear-filters-btn" onClick={handleClearAll}>
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                isSelected={entry.id === selectedId}
                onClick={() => handleEntrySelect(entry.id)}
              />
            ))
          )}
        </div>
      </main>

      {/* Detail panel */}
      {selectedEntry && data && (
        <DetailPanel
          entry={selectedEntry}
          data={data}
          onClose={() => setSelectedId(null)}
          onEntrySelect={handleEntrySelect}
        />
      )}

      {/* Export dialog */}
      {showExport && (
        <ExportDialog
          data={data}
          filteredEntries={filteredEntries}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Keyboard help */}
      {showHelp && (
        <KeyboardHelp onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}
