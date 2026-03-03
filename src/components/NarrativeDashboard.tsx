import { useMemo, useState } from 'react';
import type { DataStore, TimelineEntry, NarrativeBeat, Book } from '../types';
import { ENTRY_TYPE_COLORS } from '../data/eras';
import type { ViewMode } from './ViewModeToggle';
import './NarrativeDashboard.css';

interface Props {
  data: DataStore;
  viewMode: ViewMode;
  books: Book[];
  onEntrySelect: (id: string) => void;
}

interface ArcSummary {
  name: string;
  entries: TimelineEntry[];
  beats: Map<NarrativeBeat, TimelineEntry[]>;
  anchorCount: number;
}

const BEAT_ORDER: NarrativeBeat[] = [
  'setup', 'foreshadowing', 'inciting-incident', 'rising-action',
  'midpoint', 'climax', 'falling-action', 'resolution', 'epilogue',
];

const BEAT_LABELS: Record<NarrativeBeat, string> = {
  'setup': 'Setup',
  'foreshadowing': 'Foreshadowing',
  'inciting-incident': 'Inciting Incident',
  'rising-action': 'Rising Action',
  'midpoint': 'Midpoint',
  'climax': 'Climax',
  'falling-action': 'Falling Action',
  'resolution': 'Resolution',
  'epilogue': 'Epilogue',
};

export default function NarrativeDashboard({ data, viewMode, books, onEntrySelect }: Props) {
  const [activeBook, setActiveBook] = useState<string | null>(null);

  // Gather all creative entries, optionally filtered by book
  const creativeEntries = useMemo(() => {
    return data.entries.filter((e) => {
      const t = e.entry_type ?? 'historical';
      if (t !== 'fantasy' && t !== 'speculative') return false;
      if (activeBook !== null) {
        return (e.narrative?.book ?? null) === activeBook;
      }
      return true;
    });
  }, [data.entries, activeBook]);

  // Build arc summaries
  const arcs = useMemo<ArcSummary[]>(() => {
    const arcMap = new Map<string, ArcSummary>();

    for (const entry of creativeEntries) {
      const arcName = entry.narrative?.arc ?? 'Unassigned';
      let arc = arcMap.get(arcName);
      if (!arc) {
        arc = { name: arcName, entries: [], beats: new Map(), anchorCount: 0 };
        arcMap.set(arcName, arc);
      }
      arc.entries.push(entry);

      if (entry.narrative?.beat) {
        const beatList = arc.beats.get(entry.narrative.beat) ?? [];
        beatList.push(entry);
        arc.beats.set(entry.narrative.beat, beatList);
      }

      if (entry.narrative?.anchors) {
        arc.anchorCount += entry.narrative.anchors.length;
      }
    }

    return Array.from(arcMap.values()).sort((a, b) => b.entries.length - a.entries.length);
  }, [creativeEntries]);

  // Count statistics
  const stats = useMemo(() => {
    const fantasyCount = data.entries.filter((e) => e.entry_type === 'fantasy').length;
    const specCount = data.entries.filter((e) => e.entry_type === 'speculative').length;
    const historicalCount = data.entries.filter((e) => (e.entry_type ?? 'historical') === 'historical').length;
    const totalAnchors = creativeEntries.reduce((sum, e) => sum + (e.narrative?.anchors?.length ?? 0), 0);
    const universeCount = data.universes?.length ?? 0;

    return { fantasyCount, specCount, historicalCount, totalAnchors, universeCount, totalCreative: creativeEntries.length };
  }, [data, creativeEntries]);

  // Entries with anchors (connections to historical entries)
  const anchoredEntries = useMemo(() => {
    return creativeEntries
      .filter((e) => e.narrative?.anchors && e.narrative.anchors.length > 0)
      .map((entry) => {
        const anchors = entry.narrative!.anchors!.map((anchor) => ({
          ...anchor,
          targetEntry: data.entriesById.get(anchor.entry_id),
        }));
        return { entry, anchors };
      });
  }, [creativeEntries, data.entriesById]);

  return (
    <div className="narrative-dashboard">
      <div className="narrative-header">
        <h3>Narrative Dashboard</h3>
        <span className="narrative-subtitle">Story structure overview for creative entries</span>
      </div>

      {/* Stats cards */}
      <div className="narrative-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.historicalCount}</span>
          <span className="stat-label">Historical</span>
        </div>
        <div className="stat-card creative">
          <span className="stat-number">{stats.fantasyCount}</span>
          <span className="stat-label">Fantasy</span>
        </div>
        <div className="stat-card speculative">
          <span className="stat-number">{stats.specCount}</span>
          <span className="stat-label">Speculative</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.totalAnchors}</span>
          <span className="stat-label">Anchors</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{arcs.length}</span>
          <span className="stat-label">Arcs</span>
        </div>
      </div>

      {/* Book/Season filter (when books exist) */}
      {books.length > 0 && (
        <div className="book-filter">
          <span className="book-filter-label">Book / Season:</span>
          <div className="book-chips">
            <button
              className={`book-chip ${activeBook === null ? 'active' : ''}`}
              onClick={() => setActiveBook(null)}
            >
              All
            </button>
            {books.map((book) => (
              <button
                key={book.id}
                className={`book-chip ${activeBook === book.id ? 'active' : ''}`}
                style={{
                  borderColor: book.color,
                  ...(activeBook === book.id ? { backgroundColor: book.colorLight, color: book.color } : {}),
                }}
                onClick={() => setActiveBook(activeBook === book.id ? null : book.id)}
              >
                {book.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {creativeEntries.length === 0 ? (
        <div className="narrative-empty">
          <p>No creative entries yet. Add fantasy or speculative entries to see narrative structure here.</p>
        </div>
      ) : (
        <>
          {/* Arc breakdown */}
          <div className="narrative-section">
            <h4>Story Arcs</h4>
            <div className="arc-list">
              {arcs.map((arc) => (
                <div key={arc.name} className="arc-card">
                  <div className="arc-header">
                    <span className="arc-name">{arc.name}</span>
                    <span className="arc-count">{arc.entries.length} entries</span>
                  </div>
                  {/* Beat progress bar */}
                  <div className="beat-track">
                    {BEAT_ORDER.map((beat) => {
                      const entries = arc.beats.get(beat) ?? [];
                      const hasBeat = entries.length > 0;
                      return (
                        <div
                          key={beat}
                          className={`beat-segment ${hasBeat ? 'filled' : ''}`}
                          title={`${BEAT_LABELS[beat]}${hasBeat ? `: ${entries.map((e) => e.title).join(', ')}` : ''}`}
                        >
                          <span className="beat-label">{BEAT_LABELS[beat].substring(0, 3)}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Arc entries */}
                  <div className="arc-entries">
                    {arc.entries.map((entry) => (
                      <button
                        key={entry.id}
                        className="arc-entry-link"
                        onClick={() => onEntrySelect(entry.id)}
                        title={entry.description}
                      >
                        <span
                          className="arc-entry-type"
                          style={{ backgroundColor: ENTRY_TYPE_COLORS[entry.entry_type ?? 'historical']?.color }}
                        />
                        <span className="arc-entry-title">{entry.title}</span>
                        {entry.narrative?.book && books.length > 0 && (() => {
                          const book = books.find((b) => b.id === entry.narrative?.book);
                          return book ? (
                            <span className="arc-entry-book" style={{ color: book.color, backgroundColor: book.colorLight }}>
                              {book.name}
                            </span>
                          ) : null;
                        })()}
                        {entry.narrative?.beat && (
                          <span className="arc-entry-beat">
                            {BEAT_LABELS[entry.narrative.beat]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical anchors */}
          {anchoredEntries.length > 0 && (
            <div className="narrative-section">
              <h4>Historical Connections</h4>
              <p className="section-desc">Creative entries anchored to real historical events</p>
              <div className="anchor-list">
                {anchoredEntries.map(({ entry, anchors }) => (
                  <div key={entry.id} className="anchor-card">
                    <button
                      className="anchor-source"
                      onClick={() => onEntrySelect(entry.id)}
                    >
                      <span
                        className="anchor-dot"
                        style={{ backgroundColor: ENTRY_TYPE_COLORS[entry.entry_type ?? 'historical']?.color }}
                      />
                      {entry.title}
                    </button>
                    <div className="anchor-connections">
                      {anchors.map((anchor) => (
                        <div key={anchor.entry_id} className="anchor-connection">
                          <span className="anchor-rel">{anchor.relationship.replace(/_/g, ' ')}</span>
                          <button
                            className="anchor-target"
                            onClick={() => onEntrySelect(anchor.entry_id)}
                          >
                            {anchor.targetEntry?.title ?? anchor.entry_id}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
