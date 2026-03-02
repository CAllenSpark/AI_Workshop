import { useState, useCallback, useEffect, useMemo } from 'react';
import type { TimelineEntry, LayerKey, EraKey, ZoomLevel } from './types';
import { useTimelineData } from './hooks/useTimelineData';
import { useSearch } from './hooks/useSearch';
import { addEntry } from './data/loader';
import TimelineTrack from './components/TimelineTrack';
import EntryCard from './components/EntryCard';
import DetailPanel from './components/DetailPanel';
import FilterPanel from './components/FilterPanel';
import ExportDialog from './components/ExportDialog';
import KeyboardHelp from './components/KeyboardHelp';
import AddEntryDialog from './components/AddEntryDialog';
import HelpTutorial, { useTutorialState } from './components/HelpTutorial';
import './App.css';

const ALL_LAYERS = new Set<LayerKey>(['event', 'person', 'place', 'environment']);
const PAGE_SIZE = 50;

export default function App() {
  const { data, loading, error, setData } = useTimelineData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(new Set(ALL_LAYERS));
  const [selectedEras, setSelectedEras] = useState<Set<EraKey>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { showTutorial, dismissTutorial } = useTutorialState();

  // Compute the full date range from pre-cached dates
  const fullDateRange = useMemo<[number, number]>(() => {
    if (!data || data.entries.length === 0) return [-15000, 2026];
    let min = Infinity, max = -Infinity;
    for (const entry of data.entries) {
      const year = data.parsedDates.get(entry.id) ?? 0;
      if (year < min) min = year;
      if (year > max) max = year;
    }
    return [min, max];
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
        if (showAddEntry) { setShowAddEntry(false); return; }
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
      if ((e.key === 'e' || e.key === 'E') && !isInput && !showExport && !showHelp && !showAddEntry) {
        e.preventDefault();
        setShowExport(true);
      }
      if ((e.key === 'n' || e.key === 'N') && !isInput && !showExport && !showHelp && !showAddEntry) {
        e.preventDefault();
        setShowAddEntry(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showExport, showHelp, showAddEntry]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, activeLayers, selectedEras, dateRange]);

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

  const handleAddEntry = useCallback((entry: TimelineEntry) => {
    if (!data) return;
    setData(addEntry(data, entry));
  }, [data, setData]);

  // Combined AND filter using pre-computed dates
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

    // Filter by selected eras using pre-built index
    if (selectedEras.size > 0) {
      result = result.filter((e) => selectedEras.has(e.era));
    }

    // Filter by date range using pre-computed dates
    result = result.filter((e) => {
      const year = data.parsedDates.get(e.id) ?? 0;
      return year >= dateRange[0] && year <= dateRange[1];
    });

    return result;
  }, [data, searchQuery, search, activeLayers, selectedEras, dateRange]);

  // Paginated entries for rendering
  const paginatedEntries = useMemo(
    () => filteredEntries.slice(0, visibleCount),
    [filteredEntries, visibleCount]
  );

  const hasMore = visibleCount < filteredEntries.length;

  const selectedEntry = useMemo<TimelineEntry | null>(
    () => (selectedId && data) ? (data.entriesById.get(selectedId) ?? null) : null,
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
            className="add-entry-btn"
            onClick={() => setShowAddEntry(true)}
            aria-label="Add new entry"
            title="Add Entry (N)"
          >
            +
          </button>
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

      {/* Data validation warnings (dev info) */}
      {data.warnings.length > 0 && (
        <div className="data-warnings" role="status">
          <details>
            <summary>{data.warnings.length} data warning{data.warnings.length !== 1 ? 's' : ''}</summary>
            <ul>
              {data.warnings.slice(0, 20).map((w, i) => (
                <li key={i}>{w.message}</li>
              ))}
              {data.warnings.length > 20 && <li>...and {data.warnings.length - 20} more</li>}
            </ul>
          </details>
        </div>
      )}

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

        {/* Entry list (paginated) */}
        <div className="entry-list" role="list" aria-label="Timeline entries">
          {filteredEntries.length === 0 ? (
            <div className="empty-state" role="status">
              <p>No entries match your current filters.</p>
              <button className="clear-filters-btn" onClick={handleClearAll}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {paginatedEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  isSelected={entry.id === selectedId}
                  onClick={() => handleEntrySelect(entry.id)}
                />
              ))}
              {hasMore && (
                <div className="load-more-container">
                  <button
                    className="load-more-btn"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  >
                    Show More ({filteredEntries.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
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

      {/* Add entry dialog */}
      {showAddEntry && (
        <AddEntryDialog
          onAdd={handleAddEntry}
          onClose={() => setShowAddEntry(false)}
        />
      )}

      {/* Tutorial overlay (first visit) */}
      {showTutorial && !loading && (
        <HelpTutorial onDismiss={dismissTutorial} />
      )}
    </div>
  );
}
