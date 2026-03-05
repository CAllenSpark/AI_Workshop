import { useMemo, useState, useCallback } from 'react';
import type { DataStore, TimelineEntry, Place } from '../types';
import './MapView.css';

interface Props {
  data: DataStore;
  filteredEntries: TimelineEntry[];
  selectedEntryId: string | null;
  onEntrySelect: (id: string) => void;
}

/** Vashon Island approximate bounding box */
const MAP_BOUNDS = {
  minLat: 47.37,
  maxLat: 47.52,
  minLng: -122.52,
  maxLng: -122.39,
};

const SVG_WIDTH = 600;
const SVG_HEIGHT = 700;
const PADDING = 30;

/** Convert lat/lng to SVG coordinates within bounds */
function toSvg(lat: number, lng: number): { x: number; y: number } {
  const xPct = (lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
  const yPct = 1 - (lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
  return {
    x: PADDING + xPct * (SVG_WIDTH - 2 * PADDING),
    y: PADDING + yPct * (SVG_HEIGHT - 2 * PADDING),
  };
}

/** Get entry type color */
function getMarkerColor(place: Place): string {
  if (place.entry_type === 'fantasy') return 'var(--color-amethyst, #7B4BAA)';
  return 'var(--color-warm-amber, #8B6914)';
}

export default function MapView({ data, filteredEntries, selectedEntryId, onEntrySelect }: Props) {
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  // Places with coordinates, annotated with event counts from filtered entries
  const mappablePlaces = useMemo(() => {
    const filteredPlaceNames = new Set<string>();
    for (const entry of filteredEntries) {
      for (const name of entry.places) {
        filteredPlaceNames.add(name);
      }
    }

    return data.places
      .filter((p) => p.coordinates)
      .map((place) => {
        const entryCount = filteredEntries.filter((e) =>
          e.places.includes(place.name)
        ).length;
        const isActive = filteredPlaceNames.has(place.name);
        const relatedEntryIds = filteredEntries
          .filter((e) => e.places.includes(place.name))
          .map((e) => e.id);
        const isSelectedRelated = selectedEntryId ? relatedEntryIds.includes(selectedEntryId) : false;
        return { ...place, entryCount, isActive, relatedEntryIds, isSelectedRelated };
      });
  }, [data.places, filteredEntries, selectedEntryId]);

  const hoveredPlace = useMemo(
    () => mappablePlaces.find((p) => p.id === hoveredPlaceId),
    [mappablePlaces, hoveredPlaceId]
  );

  const handlePlaceClick = useCallback((relatedEntryIds: string[]) => {
    if (relatedEntryIds.length > 0) {
      onEntrySelect(relatedEntryIds[0]);
    }
  }, [onEntrySelect]);

  return (
    <div className="map-view">
      <div className="map-container">
        <svg
          className="map-svg"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          aria-label="Map of places with coordinates"
          role="img"
        >
          {/* Grid lines for reference */}
          <defs>
            <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--color-stone-200, #e5e0d8)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#map-grid)" rx="8" />

          {/* Place markers */}
          {mappablePlaces.map((place) => {
            const { x, y } = toSvg(place.coordinates!.lat, place.coordinates!.lng);
            const isHovered = hoveredPlaceId === place.id;
            const radius = place.isActive
              ? Math.min(6 + place.entryCount * 1.5, 16)
              : 4;

            return (
              <g
                key={place.id}
                className={`map-marker ${place.isActive ? 'active' : 'inactive'} ${isHovered ? 'hovered' : ''} ${place.isSelectedRelated ? 'selected' : ''}`}
                onMouseEnter={() => setHoveredPlaceId(place.id)}
                onMouseLeave={() => setHoveredPlaceId(null)}
                onClick={() => handlePlaceClick(place.relatedEntryIds)}
                role="button"
                tabIndex={0}
                aria-label={`${place.name}: ${place.entryCount} events`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePlaceClick(place.relatedEntryIds);
                  }
                }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={place.isActive ? getMarkerColor(place) : 'var(--color-stone-400, #a09888)'}
                  opacity={place.isActive ? 0.85 : 0.35}
                  stroke={place.isSelectedRelated ? 'var(--color-teal, #1a6b5a)' : isHovered ? '#fff' : 'none'}
                  strokeWidth={place.isSelectedRelated ? 3 : isHovered ? 2 : 0}
                />
                {/* Entry count badge for active places with multiple events */}
                {place.isActive && place.entryCount > 1 && (
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="map-marker-count"
                    fontSize="9"
                    fill="#fff"
                    fontWeight="600"
                  >
                    {place.entryCount}
                  </text>
                )}
                {/* Label for hovered place */}
                {isHovered && (
                  <text
                    x={x}
                    y={y - radius - 6}
                    textAnchor="middle"
                    className="map-marker-label"
                    fontSize="12"
                    fill="var(--color-ink, #2c2416)"
                    fontWeight="500"
                  >
                    {place.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredPlace && (
          <div className="map-tooltip" role="status" aria-live="polite">
            <strong>{hoveredPlace.name}</strong>
            <span className="map-tooltip-type">{hoveredPlace.type}</span>
            <p className="map-tooltip-desc">{hoveredPlace.description}</p>
            {hoveredPlace.entryCount > 0 && (
              <span className="map-tooltip-count">{hoveredPlace.entryCount} event{hoveredPlace.entryCount !== 1 ? 's' : ''} in current view</span>
            )}
            {hoveredPlace.coordinates && (
              <span className="map-tooltip-coords">
                {hoveredPlace.coordinates.lat.toFixed(4)}, {hoveredPlace.coordinates.lng.toFixed(4)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="map-legend">
        <h3>Map Legend</h3>
        <div className="map-legend-items">
          <div className="map-legend-item">
            <span className="map-legend-dot active-dot" />
            <span>Active (in filtered results)</span>
          </div>
          <div className="map-legend-item">
            <span className="map-legend-dot inactive-dot" />
            <span>Inactive (filtered out)</span>
          </div>
          <div className="map-legend-item">
            <span className="map-legend-dot fantasy-dot" />
            <span>Fantasy location</span>
          </div>
        </div>
        <p className="map-legend-note">
          {mappablePlaces.length} of {data.places.length} places have coordinates.
          Marker size indicates event count.
        </p>
      </div>
    </div>
  );
}
