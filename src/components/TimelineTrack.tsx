import { useRef, useCallback, useEffect, useState } from 'react';
import type { TimelineEntry, LayerKey, ZoomLevel } from '../types';
import { ERAS, LAYER_COLORS } from '../data/eras';
import { parseDate } from '../data/loader';
import './TimelineTrack.css';

interface Props {
  entries: TimelineEntry[];
  zoomLevel: ZoomLevel;
  activeLayers: Set<LayerKey>;
  selectedEntryId: string | null;
  onEntrySelect: (id: string) => void;
  onZoomChange: (zoom: ZoomLevel) => void;
}

/** Map a year to a pixel position within the track */
function yearToX(year: number, viewStart: number, viewEnd: number, width: number): number {
  const range = viewEnd - viewStart;
  if (range === 0) return 0;
  return ((year - viewStart) / range) * width;
}

/** Get the visible date range for a zoom level centered on a year */
function getViewRange(center: number, zoom: ZoomLevel): [number, number] {
  const spans: Record<ZoomLevel, number> = { 1: 17000, 2: 400, 3: 50, 4: 10 };
  const half = spans[zoom] / 2;
  return [center - half, center + half];
}

export default function TimelineTrack({
  entries,
  zoomLevel,
  activeLayers,
  selectedEntryId,
  onEntrySelect,
  onZoomChange,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(1900);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, center: 0 });
  const [trackWidth, setTrackWidth] = useState(1200);

  // Measure track width
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver((obs) => {
      setTrackWidth(obs[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [viewStart, viewEnd] = getViewRange(center, zoomLevel);

  // Filter entries by active layers
  const visible = entries.filter((e) =>
    e.layers.some((l) => activeLayers.has(l as LayerKey))
  );

  // Drag to scrub
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, center };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [center]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const range = viewEnd - viewStart;
      const yearDelta = (dx / trackWidth) * range;
      setCenter(dragStartRef.current.center - yearDelta);
    },
    [isDragging, viewStart, viewEnd, trackWidth]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Scroll wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0 && zoomLevel < 4) {
        onZoomChange((zoomLevel + 1) as ZoomLevel);
      } else if (e.deltaY > 0 && zoomLevel > 1) {
        onZoomChange((zoomLevel - 1) as ZoomLevel);
      }
    },
    [zoomLevel, onZoomChange]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const range = viewEnd - viewStart;
      const step = range * 0.1;
      if (e.key === 'ArrowLeft') {
        setCenter((c) => c - step);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setCenter((c) => c + step);
        e.preventDefault();
      } else if (e.key === '+' || e.key === '=') {
        if (zoomLevel < 4) onZoomChange((zoomLevel + 1) as ZoomLevel);
        e.preventDefault();
      } else if (e.key === '-') {
        if (zoomLevel > 1) onZoomChange((zoomLevel - 1) as ZoomLevel);
        e.preventDefault();
      }
    },
    [viewStart, viewEnd, zoomLevel, onZoomChange]
  );

  // Group entries into clusters when they overlap
  const entryPositions = visible.map((entry) => {
    const year = parseDate(entry.date_start);
    const x = yearToX(year, viewStart, viewEnd, trackWidth);
    return { entry, x, year };
  });

  // Format year label
  const formatYear = (year: number): string => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year}`;
  };

  // Generate tick marks
  const ticks: { year: number; x: number; label: string }[] = [];
  const range = viewEnd - viewStart;
  let tickInterval = 1000;
  if (range < 100) tickInterval = 5;
  else if (range < 500) tickInterval = 50;
  else if (range < 2000) tickInterval = 100;
  else if (range < 10000) tickInterval = 1000;
  else tickInterval = 5000;

  const firstTick = Math.ceil(viewStart / tickInterval) * tickInterval;
  for (let y = firstTick; y <= viewEnd; y += tickInterval) {
    ticks.push({
      year: y,
      x: yearToX(y, viewStart, viewEnd, trackWidth),
      label: formatYear(y),
    });
  }

  return (
    <div className="timeline-container">
      {/* Zoom controls */}
      <div className="timeline-controls">
        <button
          onClick={() => zoomLevel > 1 && onZoomChange((zoomLevel - 1) as ZoomLevel)}
          disabled={zoomLevel === 1}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="zoom-label">
          {['Era', 'Century', 'Decade', 'Year'][zoomLevel - 1]} View
        </span>
        <button
          onClick={() => zoomLevel < 4 && onZoomChange((zoomLevel + 1) as ZoomLevel)}
          disabled={zoomLevel === 4}
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      {/* Main track */}
      <div
        ref={trackRef}
        className={`timeline-track ${isDragging ? 'dragging' : ''}`}
        role="region"
        aria-label="Timeline"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
      >
        {/* Era bands */}
        <div className="era-bands">
          {ERAS.map((era) => {
            const left = yearToX(era.start, viewStart, viewEnd, trackWidth);
            const right = yearToX(era.end, viewStart, viewEnd, trackWidth);
            const width = right - left;
            if (left > trackWidth || right < 0 || width < 2) return null;
            return (
              <div
                key={era.key}
                className="era-band"
                style={{
                  left: `${Math.max(0, left)}px`,
                  width: `${Math.min(width, trackWidth - Math.max(0, left))}px`,
                  backgroundColor: era.colorLight,
                  borderBottom: `3px solid ${era.color}`,
                }}
                title={`${era.name} (${formatYear(era.start)} – ${formatYear(era.end)})`}
              >
                {width > 60 && (
                  <span className="era-label" style={{ color: era.color }}>
                    {era.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Tick marks */}
        <div className="tick-marks">
          {ticks.map((tick) => (
            <div
              key={tick.year}
              className="tick"
              style={{ left: `${tick.x}px` }}
            >
              <div className="tick-line" />
              <span className="tick-label">{tick.label}</span>
            </div>
          ))}
        </div>

        {/* Entry markers */}
        <div className="entry-markers">
          {entryPositions
            .filter(({ x }) => x >= -20 && x <= trackWidth + 20)
            .map(({ entry, x }) => {
              const primaryLayer = entry.layers[0] || 'event';
              const lc = LAYER_COLORS[primaryLayer] || LAYER_COLORS.event;
              const isSelected = entry.id === selectedEntryId;
              return (
                <button
                  key={entry.id}
                  className={`entry-marker ${isSelected ? 'selected' : ''}`}
                  style={{
                    left: `${x}px`,
                    backgroundColor: lc.color,
                    transform: isSelected ? 'translateX(-50%) scale(1.4)' : 'translateX(-50%)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEntrySelect(entry.id);
                  }}
                  aria-label={`${entry.title} (${entry.date_start})`}
                  title={entry.title}
                />
              );
            })}
        </div>
      </div>

      {/* Minimap slider */}
      <div className="timeline-minimap">
        <div className="minimap-track">
          {ERAS.map((era) => {
            const left = yearToX(era.start, -15000, 2026, trackWidth);
            const right = yearToX(era.end, -15000, 2026, trackWidth);
            return (
              <div
                key={era.key}
                className="minimap-era"
                style={{
                  left: `${(left / trackWidth) * 100}%`,
                  width: `${((right - left) / trackWidth) * 100}%`,
                  backgroundColor: era.color,
                  opacity: 0.3,
                }}
              />
            );
          })}
          {/* Viewport indicator */}
          <div
            className="minimap-viewport"
            style={{
              left: `${((viewStart + 15000) / 17026) * 100}%`,
              width: `${(range / 17026) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Era quick-jump buttons */}
      <div className="era-jumps">
        {ERAS.map((era) => (
          <button
            key={era.key}
            className="era-jump-btn"
            style={{ borderColor: era.color, color: era.color }}
            onClick={() => {
              setCenter((era.start + era.end) / 2);
              if (zoomLevel < 2) onZoomChange(2);
            }}
            title={era.name}
          >
            {era.name.length > 12 ? era.name.substring(0, 10) + '…' : era.name}
          </button>
        ))}
      </div>
    </div>
  );
}
