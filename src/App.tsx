import { useState, useCallback, useEffect, useMemo } from 'react';
import type { TimelineEntry, LayerKey, ZoomLevel } from './types';
import { useTimelineData } from './hooks/useTimelineData';
import { LAYER_COLORS } from './data/eras';
import TimelineTrack from './components/TimelineTrack';
import EntryCard from './components/EntryCard';
import DetailPanel from './components/DetailPanel';
import './App.css';

export default function App() {
  const { data, loading, error } = useTimelineData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(
    new Set(['event', 'person', 'place', 'environment'])
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut: Escape to close detail panel, / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
      if (e.key === '/' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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

  // Filter entries
  const filteredEntries = useMemo(() => {
    if (!data) return [];
    let result = data.entries.filter((e) =>
      e.layers.some((l) => activeLayers.has(l as LayerKey))
    );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.people.some((p) => p.toLowerCase().includes(q)) ||
          e.places.some((p) => p.toLowerCase().includes(q)) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [data, activeLayers, searchQuery]);

  const selectedEntry = useMemo<TimelineEntry | null>(
    () => data?.entries.find((e) => e.id === selectedId) ?? null,
    [data, selectedId]
  );

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading Vashon Island knowledge base...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-error">
        <h2>Failed to load data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`app ${selectedEntry ? 'panel-open' : ''}`}>
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
            <span className="search-count">{filteredEntries.length} results</span>
          )}
        </div>
        <div className="header-right">
          <span className="entry-count">{filteredEntries.length} / {data.entries.length} entries</span>
        </div>
      </header>

      {/* Layer toggles */}
      <nav className="layer-toggles" aria-label="Data layer filters">
        {(Object.entries(LAYER_COLORS) as [string, typeof LAYER_COLORS.event][]).map(
          ([key, lc]) => (
            <button
              key={key}
              className={`layer-toggle ${activeLayers.has(key as LayerKey) ? 'active' : ''}`}
              style={{
                borderColor: lc.color,
                backgroundColor: activeLayers.has(key as LayerKey) ? lc.bg : 'transparent',
                color: lc.color,
              }}
              onClick={() => toggleLayer(key as LayerKey)}
              aria-pressed={activeLayers.has(key as LayerKey)}
            >
              <span
                className="toggle-dot"
                style={{ backgroundColor: activeLayers.has(key as LayerKey) ? lc.color : 'transparent' }}
              />
              {lc.label}
            </button>
          )
        )}
      </nav>

      {/* Timeline */}
      <main className="app-main">
        <TimelineTrack
          entries={data.entries}
          zoomLevel={zoomLevel}
          activeLayers={activeLayers}
          selectedEntryId={selectedId}
          onEntrySelect={handleEntrySelect}
          onZoomChange={setZoomLevel}
        />

        {/* Entry list */}
        <div className="entry-list">
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              isSelected={entry.id === selectedId}
              onClick={() => handleEntrySelect(entry.id)}
            />
          ))}
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
    </div>
  );
}
