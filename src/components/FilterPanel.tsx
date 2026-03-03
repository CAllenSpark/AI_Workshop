import { useMemo } from 'react';
import type { EraKey, LayerKey, EntryType } from '../types';
import { ERAS, LAYER_COLORS, ENTRY_TYPE_COLORS } from '../data/eras';
import type { ViewMode } from './ViewModeToggle';
import './FilterPanel.css';

interface Props {
  activeLayers: Set<LayerKey>;
  selectedEras: Set<EraKey>;
  dateRange: [number, number];
  fullDateRange: [number, number];
  totalCount: number;
  filteredCount: number;
  viewMode: ViewMode;
  onLayerToggle: (layer: LayerKey) => void;
  onEraToggle: (era: EraKey) => void;
  onDateRangeChange: (range: [number, number]) => void;
  onClearAll: () => void;
}

const ENTRY_TYPE_KEYS: EntryType[] = ['historical', 'fantasy', 'speculative'];

export default function FilterPanel({
  activeLayers,
  selectedEras,
  dateRange,
  fullDateRange,
  totalCount,
  filteredCount,
  viewMode,
  onLayerToggle,
  onEraToggle,
  onDateRangeChange,
  onClearAll,
}: Props) {
  const hasActiveFilters = useMemo(() => {
    return (
      activeLayers.size < 4 ||
      selectedEras.size > 0 ||
      dateRange[0] !== fullDateRange[0] ||
      dateRange[1] !== fullDateRange[1]
    );
  }, [activeLayers, selectedEras, dateRange, fullDateRange]);

  const formatYear = (year: number): string => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year} CE`;
  };

  return (
    <div className="filter-panel">
      {/* Layer toggles */}
      <div className="filter-section">
        <div className="filter-section-header">
          <span className="filter-label">Layers</span>
        </div>
        <div className="layer-toggles-row">
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
                onClick={() => onLayerToggle(key as LayerKey)}
                aria-pressed={activeLayers.has(key as LayerKey)}
              >
                <span
                  className="toggle-dot"
                  style={{
                    backgroundColor: activeLayers.has(key as LayerKey) ? lc.color : 'transparent',
                  }}
                />
                {lc.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Active view mode indicator (shows when not in 'all' mode) */}
      {viewMode !== 'all' && (
        <div className="filter-section filter-active-mode">
          <span className="filter-active-mode-label">
            Viewing: <strong style={{ color: viewMode === 'creative' ? 'var(--creative-primary)' : ENTRY_TYPE_COLORS.historical.color }}>
              {viewMode === 'historical' ? 'Historical entries only' : 'Creative entries only'}
            </strong>
          </span>
        </div>
      )}

      {/* Era filter */}
      <div className="filter-section">
        <div className="filter-section-header">
          <span className="filter-label">Eras</span>
          {selectedEras.size > 0 && (
            <span className="filter-count">{selectedEras.size} selected</span>
          )}
        </div>
        <div className="era-chips">
          {ERAS.map((era) => (
            <button
              key={era.key}
              className={`era-chip ${selectedEras.has(era.key) ? 'active' : ''}`}
              style={{
                borderColor: era.color,
                backgroundColor: selectedEras.has(era.key) ? era.colorLight : 'transparent',
                color: era.color,
              }}
              onClick={() => onEraToggle(era.key)}
              aria-pressed={selectedEras.has(era.key)}
            >
              {era.name}
            </button>
          ))}
        </div>
      </div>

      {/* Date range slider */}
      <div className="filter-section">
        <div className="filter-section-header">
          <span className="filter-label">Date Range</span>
          <span className="filter-range-display">
            {formatYear(dateRange[0])} — {formatYear(dateRange[1])}
          </span>
        </div>
        <div className="date-range-sliders">
          <input
            type="range"
            className="range-slider range-start"
            min={fullDateRange[0]}
            max={fullDateRange[1]}
            value={dateRange[0]}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < dateRange[1]) onDateRangeChange([val, dateRange[1]]);
            }}
            aria-label="Start date"
          />
          <input
            type="range"
            className="range-slider range-end"
            min={fullDateRange[0]}
            max={fullDateRange[1]}
            value={dateRange[1]}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > dateRange[0]) onDateRangeChange([dateRange[0], val]);
            }}
            aria-label="End date"
          />
        </div>
      </div>

      {/* Footer with count and clear */}
      <div className="filter-footer">
        <span className="filter-result-count">
          Showing <strong>{filteredCount}</strong> of {totalCount} entries
        </span>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={onClearAll}>
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
