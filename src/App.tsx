import { useState, useCallback, useEffect, useMemo } from 'react';
import type { TimelineEntry, LayerKey, EraKey, ZoomLevel, EntryType, ScopeKey, Project, DataStore, Universe } from './types';
import { useTimelineData } from './hooks/useTimelineData';
import { useSearch } from './hooks/useSearch';
import { addEntry, buildDataStore } from './data/loader';
import {
  getActiveProjectId,
  setActiveProjectId,
  getProject,
  loadProjectData,
  DEFAULT_PROJECT_ID,
  DEFAULT_PROJECT,
} from './data/project-manager';
import TimelineTrack from './components/TimelineTrack';
import EntryCard from './components/EntryCard';
import DetailPanel from './components/DetailPanel';
import FilterPanel from './components/FilterPanel';
import ViewModeToggle from './components/ViewModeToggle';
import type { ViewMode } from './components/ViewModeToggle';
import TabNav from './components/TabNav';
import type { TabKey } from './components/TabNav';
import PeopleTimeline from './components/PeopleTimeline';
import NarrativeDashboard from './components/NarrativeDashboard';
import MapView from './components/MapView';
import ProjectSelector from './components/ProjectSelector';
import ExportDialog from './components/ExportDialog';
import KeyboardHelp from './components/KeyboardHelp';
import AddEntryDialog from './components/AddEntryDialog';
import HelpTutorial, { useTutorialState } from './components/HelpTutorial';
import './App.css';

const ALL_LAYERS = new Set<LayerKey>(['event', 'person', 'place', 'environment']);
const ALL_SCOPES = new Set<ScopeKey>(['vashon', 'seattle', 'tacoma', 'national']);
const PAGE_SIZE = 50;

export default function App() {
  // Project state
  const [activeProject, setActiveProject] = useState<Project>(() => {
    const id = getActiveProjectId();
    return getProject(id) ?? DEFAULT_PROJECT;
  });

  // Default project uses static file loader; user projects use localStorage
  const { data: defaultData, loading, error, setData: setDefaultData } = useTimelineData();
  const [userProjectData, setUserProjectData] = useState<DataStore | null>(null);

  const isDefaultProject = activeProject.id === DEFAULT_PROJECT_ID;
  const data = isDefaultProject ? defaultData : userProjectData;

  const setData = useCallback((store: DataStore) => {
    if (isDefaultProject) {
      setDefaultData(store);
    } else {
      setUserProjectData(store);
    }
  }, [isDefaultProject, setDefaultData]);

  // Load user project data when switching to a non-default project
  const handleProjectChange = useCallback((projectId: string) => {
    const project = getProject(projectId) ?? DEFAULT_PROJECT;
    setActiveProjectId(projectId);
    setActiveProject(project);
    setSelectedId(null);
    setSearchQuery('');
    setVisibleCount(PAGE_SIZE);
    setSelectedEras(new Set());
    setActiveLayers(new Set(ALL_LAYERS));
    setActiveScopes(new Set(ALL_SCOPES));

    if (projectId === DEFAULT_PROJECT_ID) {
      setUserProjectData(null);
    } else {
      const pd = loadProjectData(projectId);
      if (pd) {
        setUserProjectData(
          buildDataStore(pd.entries, pd.people, pd.places, pd.environment, pd.universes, pd.props, pd.lore ?? [], pd.worldRules ?? [])
        );
      } else {
        // Empty project
        setUserProjectData(
          buildDataStore([], [], [], [], [], [])
        );
      }
    }
  }, []);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(new Set(ALL_LAYERS));
  const [selectedEras, setSelectedEras] = useState<Set<EraKey>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [activeTab, setActiveTab] = useState<TabKey>('timeline');
  const [activeScopes, setActiveScopes] = useState<Set<ScopeKey>>(new Set(ALL_SCOPES));

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

  // Universe lookup map for EntryCard
  const universesById = useMemo(() => {
    const map = new Map<string, Universe>();
    if (!data) return map;
    for (const u of data.universes ?? []) {
      map.set(u.id, u);
    }
    return map;
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
      // Tab switching: 1 = timeline, 2 = people, 3 = narrative
      if (e.key === '1' && !isInput && !showExport && !showHelp && !showAddEntry) {
        setActiveTab('timeline');
      }
      if (e.key === '2' && !isInput && !showExport && !showHelp && !showAddEntry) {
        setActiveTab('people');
      }
      if (e.key === '3' && !isInput && !showExport && !showHelp && !showAddEntry) {
        setActiveTab('narrative');
      }
      if (e.key === '4' && !isInput && !showExport && !showHelp && !showAddEntry) {
        setActiveTab('map');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showExport, showHelp, showAddEntry]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, activeLayers, selectedEras, activeScopes, dateRange, viewMode]);

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

  const toggleScope = useCallback((scope: ScopeKey) => {
    setActiveScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) next.delete(scope);
      else next.add(scope);
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveLayers(new Set(ALL_LAYERS));
    setSelectedEras(new Set());
    setActiveScopes(new Set(ALL_SCOPES));
    setDateRange(fullDateRange);
    setSearchQuery('');
  }, [fullDateRange]);

  const handleAddEntry = useCallback((entry: TimelineEntry) => {
    if (!data) return;
    setData(addEntry(data, entry));
  }, [data, setData]);

  // Entry type counts for the view mode toggle (uses pre-built entriesByType index)
  const entryTypeCounts = useMemo<Record<EntryType | 'creative' | 'all', number>>(() => {
    if (!data) return { historical: 0, fantasy: 0, speculative: 0, creative: 0, all: 0 };
    const fantasyCount = data.entriesByType.get('fantasy')?.length ?? 0;
    const specCount = data.entriesByType.get('speculative')?.length ?? 0;
    return {
      historical: data.entriesByType.get('historical')?.length ?? 0,
      fantasy: fantasyCount,
      speculative: specCount,
      creative: fantasyCount + specCount,
      all: data.entries.length,
    };
  }, [data]);

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

    // Filter by view mode (entry type)
    if (viewMode === 'historical') {
      result = result.filter((e) => (e.entry_type ?? 'historical') === 'historical');
    } else if (viewMode === 'creative') {
      result = result.filter((e) => {
        const t = e.entry_type ?? 'historical';
        return t === 'fantasy' || t === 'speculative';
      });
    }

    // Filter by scope
    if (activeScopes.size < ALL_SCOPES.size) {
      result = result.filter((e) => activeScopes.has((e.scope ?? 'vashon') as ScopeKey));
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
  }, [data, searchQuery, search, activeLayers, selectedEras, activeScopes, dateRange, viewMode]);

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

  if (loading && isDefaultProject) {
    return (
      <div className="app-loading" role="status">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading {activeProject.setting} knowledge base...</p>
      </div>
    );
  }

  if (error && isDefaultProject) {
    return (
      <div className="app-error" role="alert">
        <h2>Failed to load data</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app-loading" role="status">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading {activeProject.setting} knowledge base...</p>
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
          <ProjectSelector
            activeProject={activeProject}
            onProjectChange={handleProjectChange}
          />
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
          <ViewModeToggle
            viewMode={viewMode}
            onChange={setViewMode}
            counts={entryTypeCounts}
          />
          <span className="entry-count">{filteredEntries.length} / {data.entries.length} entries</span>
        </div>
      </header>

      {/* Tab navigation */}
      <TabNav activeTab={activeTab} onChange={setActiveTab} />

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
          activeScopes={activeScopes}
          dateRange={dateRange}
          fullDateRange={fullDateRange}
          totalCount={data.entries.length}
          filteredCount={filteredEntries.length}
          viewMode={viewMode}
          onLayerToggle={toggleLayer}
          onEraToggle={toggleEra}
          onScopeToggle={toggleScope}
          onDateRangeChange={setDateRange}
          onClearAll={handleClearAll}
        />
      </nav>

      {/* Live region for filter count announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing {filteredEntries.length} of {data.entries.length} entries
      </div>

      {/* Main content — tab panels */}
      <main id="main-content" className="app-main">
        {activeTab === 'timeline' && (
          <div id="panel-timeline" role="tabpanel" aria-label="Timeline view">
            <TimelineTrack
              entries={filteredEntries}
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
                      universesById={universesById}
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
          </div>
        )}

        {activeTab === 'people' && (
          <div id="panel-people" role="tabpanel" aria-label="People timeline view">
            <PeopleTimeline
              data={data}
              viewMode={viewMode}
              onEntrySelect={handleEntrySelect}
            />
          </div>
        )}

        {activeTab === 'narrative' && (
          <div id="panel-narrative" role="tabpanel" aria-label="Narrative dashboard view">
            <NarrativeDashboard
              data={data}
              viewMode={viewMode}
              books={activeProject.books}
              onEntrySelect={handleEntrySelect}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div id="panel-map" role="tabpanel" aria-label="Map view">
            <MapView
              data={data}
              filteredEntries={filteredEntries}
              selectedEntryId={selectedId}
              onEntrySelect={handleEntrySelect}
            />
          </div>
        )}
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
