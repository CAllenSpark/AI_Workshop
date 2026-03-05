import { useMemo, useState } from 'react';
import type { Person, DataStore } from '../types';
import { ENTRY_TYPE_COLORS } from '../data/eras';
import type { ViewMode } from './ViewModeToggle';
import './PeopleTimeline.css';

interface Props {
  data: DataStore;
  viewMode: ViewMode;
  onEntrySelect: (id: string) => void;
}

interface PersonBar {
  person: Person;
  startYear: number;
  endYear: number;
  entryType: 'historical' | 'fantasy';
}

/** Parse a period string like "1850–1920" or "Active 1790" into [start, end] */
function parsePeriod(period: string | undefined): [number, number] | null {
  if (!period) return null;

  // "~1500–1856" or "1850 – 1920"
  const rangeMatch = period.match(/~?(\d{3,5})\s*[–\-]\s*~?(\d{3,5})/);
  if (rangeMatch) {
    return [parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10)];
  }

  // "1500 BCE – 1856" or similar with BCE
  const bceRangeMatch = period.match(/~?(\d+)\s*BCE\s*[–\-]\s*~?(\d+)/i);
  if (bceRangeMatch) {
    return [-parseInt(bceRangeMatch[1], 10), parseInt(bceRangeMatch[2], 10)];
  }

  // "Active 1790" or "Active on ... in 1790" or "1990s"
  const singleMatch = period.match(/(\d{4})/);
  if (singleMatch) {
    const year = parseInt(singleMatch[1], 10);
    // For decade references like "1990s–2000s", try to get end
    const decadeEnd = period.match(/(\d{4})s/g);
    if (decadeEnd && decadeEnd.length >= 2) {
      const start = parseInt(decadeEnd[0], 10);
      const end = parseInt(decadeEnd[decadeEnd.length - 1], 10) + 9;
      return [start, end];
    }
    // For "1990s" alone
    if (period.includes('s')) {
      return [year, year + 9];
    }
    return [year, year + 5]; // Give single years a small span
  }

  return null;
}

export default function PeopleTimeline({ data, viewMode, onEntrySelect }: Props) {
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'start' | 'name'>('start');

  // Build person bars with parsed periods
  const personBars = useMemo<PersonBar[]>(() => {
    return data.people
      .map((person) => {
        const period = parsePeriod(person.period);
        if (!period) return null;
        const entryType = person.entry_type ?? 'historical';
        return {
          person,
          startYear: period[0],
          endYear: period[1],
          entryType: entryType as 'historical' | 'fantasy',
        };
      })
      .filter((bar): bar is PersonBar => bar !== null);
  }, [data.people]);

  // Filter by view mode
  const filteredBars = useMemo(() => {
    let bars = personBars;
    if (viewMode === 'historical') {
      bars = bars.filter((b) => b.entryType === 'historical');
    } else if (viewMode === 'creative') {
      bars = bars.filter((b) => b.entryType === 'fantasy');
    }

    // Sort
    if (sortBy === 'start') {
      bars = [...bars].sort((a, b) => a.startYear - b.startYear);
    } else {
      bars = [...bars].sort((a, b) => a.person.name.localeCompare(b.person.name));
    }
    return bars;
  }, [personBars, viewMode, sortBy]);

  // Calculate timeline range
  const timeRange = useMemo<[number, number]>(() => {
    if (filteredBars.length === 0) return [-15000, 2026];
    let min = Infinity, max = -Infinity;
    for (const bar of filteredBars) {
      if (bar.startYear < min) min = bar.startYear;
      if (bar.endYear > max) max = bar.endYear;
    }
    // Add 2% padding
    const span = max - min;
    return [min - span * 0.02, max + span * 0.02];
  }, [filteredBars]);

  const yearToPercent = (year: number): number => {
    const [rangeStart, rangeEnd] = timeRange;
    return ((year - rangeStart) / (rangeEnd - rangeStart)) * 100;
  };

  const formatYear = (year: number): string => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year}`;
  };

  // Generate decade/century tick marks
  const ticks = useMemo(() => {
    const [start, end] = timeRange;
    const range = end - start;
    let interval = 100;
    if (range < 200) interval = 10;
    else if (range < 1000) interval = 50;
    else if (range < 5000) interval = 100;
    else interval = 1000;

    const result: { year: number; pct: number }[] = [];
    const first = Math.ceil(start / interval) * interval;
    for (let y = first; y <= end; y += interval) {
      result.push({ year: y, pct: yearToPercent(y) });
    }
    return result;
  }, [timeRange]);

  return (
    <div className="people-timeline">
      <div className="people-timeline-header">
        <h3>People Timeline</h3>
        <div className="people-timeline-controls">
          <span className="people-count">{filteredBars.length} people</span>
          <div className="sort-toggle">
            <button
              className={sortBy === 'start' ? 'active' : ''}
              onClick={() => setSortBy('start')}
            >
              By Date
            </button>
            <button
              className={sortBy === 'name' ? 'active' : ''}
              onClick={() => setSortBy('name')}
            >
              By Name
            </button>
          </div>
        </div>
      </div>

      {/* Tick marks axis */}
      <div className="people-timeline-axis">
        {ticks.map(({ year, pct }) => (
          <div
            key={year}
            className="people-tick"
            style={{ left: `${pct}%` }}
          >
            <span className="people-tick-label">{formatYear(year)}</span>
          </div>
        ))}
      </div>

      {/* Lifespan bars */}
      <div className="people-bars" role="list" aria-label="People lifespan bars">
        {filteredBars.length === 0 ? (
          <div className="people-empty">No people to display for the current view mode.</div>
        ) : (
          filteredBars.map((bar) => {
            const leftPct = yearToPercent(bar.startYear);
            const widthPct = yearToPercent(bar.endYear) - leftPct;
            const isCreative = bar.entryType === 'fantasy';
            const color = isCreative
              ? ENTRY_TYPE_COLORS.fantasy.color
              : '#2B7A7A'; // Person layer color
            const isHovered = hoveredPerson === bar.person.id;

            return (
              <div
                key={bar.person.id}
                className={`person-row ${isHovered ? 'hovered' : ''}`}
                role="listitem"
                onMouseEnter={() => setHoveredPerson(bar.person.id)}
                onMouseLeave={() => setHoveredPerson(null)}
              >
                <div className="person-label">
                  <span className="person-name" title={bar.person.name}>
                    {bar.person.name}
                  </span>
                  <span className="person-role">{bar.person.role}</span>
                </div>
                <div className="person-bar-track">
                  <div
                    className={`person-bar ${isCreative ? 'creative' : ''}`}
                    style={{
                      left: `${leftPct}%`,
                      width: `${Math.max(widthPct, 0.5)}%`,
                      backgroundColor: color,
                    }}
                    title={`${bar.person.name}: ${formatYear(bar.startYear)} – ${formatYear(bar.endYear)}`}
                  >
                    {isHovered && widthPct > 8 && (
                      <span className="bar-period">
                        {formatYear(bar.startYear)} – {formatYear(bar.endYear)}
                      </span>
                    )}
                  </div>
                  {/* Related entry dots */}
                  {isHovered && bar.person.related_entries?.map((eid) => {
                    const entry = data.entriesById.get(eid);
                    if (!entry) return null;
                    const entryYear = data.parsedDates.get(eid) ?? 0;
                    const dotPct = yearToPercent(entryYear);
                    if (dotPct < 0 || dotPct > 100) return null;
                    return (
                      <button
                        key={eid}
                        className="entry-dot"
                        style={{ left: `${dotPct}%` }}
                        title={entry.title}
                        onClick={() => onEntrySelect(eid)}
                        aria-label={`Go to entry: ${entry.title}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
