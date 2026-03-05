import { useMemo, useState } from 'react';
import type { DataStore, TimelineEntry, NarrativeBeat, Book, Universe, WorldRule, Lore, NarrativeProp } from '../types';
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

/** Collapsible section wrapper for dashboard sections */
function DashboardSection({ title, subtitle, count, defaultOpen = true, children }: {
  title: string;
  subtitle?: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="narrative-section">
      <button
        className="narrative-section-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <h4>
          {title}
          {count !== undefined && <span className="section-count">{count}</span>}
        </h4>
        {subtitle && <span className="section-desc">{subtitle}</span>}
        <span className={`toggle-chevron ${open ? 'open' : ''}`} aria-hidden="true">&#9662;</span>
      </button>
      {open && <div className="narrative-section-content">{children}</div>}
    </div>
  );
}

/** Category labels for world rules */
const RULE_CATEGORY_LABELS: Record<string, string> = {
  supernatural: 'Supernatural',
  physics: 'Physics',
  social: 'Social',
  narrative: 'Narrative',
  setting: 'Setting',
  magic: 'Magic',
  technology: 'Technology',
  other: 'Other',
};

/** Lore type labels */
const LORE_TYPE_LABELS: Record<string, string> = {
  folk_tale: 'Folk Tale',
  oral_tradition: 'Oral Tradition',
  legend: 'Legend',
  myth: 'Myth',
  superstition: 'Superstition',
  song: 'Song',
  proverb: 'Proverb',
  ritual: 'Ritual',
  custom: 'Custom',
  prophecy: 'Prophecy',
};

/** Prop function labels */
const PROP_FUNCTION_LABELS: Record<string, string> = {
  macguffin: 'MacGuffin',
  key: 'Key',
  clue: 'Clue',
  weapon: 'Weapon',
  symbol: 'Symbol',
  catalyst: 'Catalyst',
  heirloom: 'Heirloom',
  evidence: 'Evidence',
  transport: 'Transport',
  other: 'Other',
};

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

export default function NarrativeDashboard({ data, viewMode: _viewMode, books, onEntrySelect }: Props) {
  const [activeBook, setActiveBook] = useState<string | null>(null);
  const [activeUniverse, setActiveUniverse] = useState<string | null>(null);

  // Gather all creative entries, optionally filtered by book and universe
  const creativeEntries = useMemo(() => {
    return data.entries.filter((e) => {
      const t = e.entry_type ?? 'historical';
      if (t !== 'fantasy' && t !== 'speculative') return false;
      if (activeBook !== null) {
        if ((e.narrative?.book ?? null) !== activeBook) return false;
      }
      if (activeUniverse !== null) {
        if ((e.universe_id ?? null) !== activeUniverse) return false;
      }
      return true;
    });
  }, [data.entries, activeBook, activeUniverse]);

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
    const worldRuleCount = data.worldRules?.length ?? 0;
    const loreCount = data.lore?.length ?? 0;
    const propCount = data.props?.length ?? 0;

    return { fantasyCount, specCount, historicalCount, totalAnchors, universeCount, worldRuleCount, loreCount, propCount, totalCreative: creativeEntries.length };
  }, [data, creativeEntries]);

  // Resolve universe lookup
  const universesById = useMemo(() => {
    const map = new Map<string, Universe>();
    for (const u of data.universes ?? []) {
      map.set(u.id, u);
    }
    return map;
  }, [data.universes]);

  // World rules grouped by category
  const worldRulesByCategory = useMemo(() => {
    const map = new Map<string, WorldRule[]>();
    for (const rule of data.worldRules ?? []) {
      if (activeUniverse !== null && rule.universe_id !== activeUniverse) continue;
      const cat = rule.category ?? 'other';
      const list = map.get(cat) ?? [];
      list.push(rule);
      map.set(cat, list);
    }
    return map;
  }, [data.worldRules, activeUniverse]);

  // Lore grouped by type
  const loreByType = useMemo(() => {
    const map = new Map<string, Lore[]>();
    for (const item of data.lore ?? []) {
      if (activeUniverse !== null && item.universe_id !== activeUniverse) continue;
      const t = item.type ?? 'legend';
      const list = map.get(t) ?? [];
      list.push(item);
      map.set(t, list);
    }
    return map;
  }, [data.lore, activeUniverse]);

  // Narrative props
  const filteredProps = useMemo(() => {
    return (data.props ?? []).filter((p) => {
      if (activeUniverse !== null && p.universe_id !== activeUniverse) return false;
      return true;
    });
  }, [data.props, activeUniverse]);

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

      {/* Universe cards — always visible when universes exist */}
      {(data.universes ?? []).length > 0 && (
        <DashboardSection title="Universes" count={data.universes.length} defaultOpen={true}>
          <div className="universe-cards">
            {data.universes.map((universe) => {
              const isActive = activeUniverse === universe.id;
              const entryCount = data.entries.filter((e) => e.universe_id === universe.id).length;
              return (
                <button
                  key={universe.id}
                  className={`universe-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveUniverse(isActive ? null : universe.id)}
                  aria-pressed={isActive}
                >
                  <div className="universe-card-header">
                    <span className="universe-name">{universe.name}</span>
                    {universe.genre && (
                      <span className="universe-genre">{universe.genre}</span>
                    )}
                  </div>
                  <p className="universe-desc">{universe.description}</p>
                  {universe.themes && universe.themes.length > 0 && (
                    <div className="universe-themes">
                      {universe.themes.map((theme) => (
                        <span key={theme} className="universe-theme">{theme}</span>
                      ))}
                    </div>
                  )}
                  <div className="universe-meta">
                    <span className="universe-entry-count">{entryCount} entries</span>
                    {universe.created_by && (
                      <span className="universe-creator">by {universe.created_by}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </DashboardSection>
      )}

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
        {stats.worldRuleCount > 0 && (
          <div className="stat-card creative">
            <span className="stat-number">{stats.worldRuleCount}</span>
            <span className="stat-label">World Rules</span>
          </div>
        )}
        {stats.loreCount > 0 && (
          <div className="stat-card creative">
            <span className="stat-number">{stats.loreCount}</span>
            <span className="stat-label">Lore</span>
          </div>
        )}
        {stats.propCount > 0 && (
          <div className="stat-card creative">
            <span className="stat-number">{stats.propCount}</span>
            <span className="stat-label">Props</span>
          </div>
        )}
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
          <DashboardSection title="Story Arcs" count={arcs.length} defaultOpen={true}>
            <div className="arc-list">
              {arcs.map((arc) => (
                <div key={arc.name} className="arc-card">
                  <div className="arc-header">
                    <span className="arc-name">{arc.name}</span>
                    <span className="arc-count">{arc.entries.length} entries | {arc.anchorCount} anchors</span>
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
                    {arc.entries.map((entry) => {
                      const universe = entry.universe_id ? universesById.get(entry.universe_id) : undefined;
                      return (
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
                          {universe && (
                            <span className="arc-entry-universe">{universe.name}</span>
                          )}
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
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>

          {/* Historical anchors */}
          {anchoredEntries.length > 0 && (
            <DashboardSection title="Historical Connections" subtitle="Creative entries anchored to real historical events" count={anchoredEntries.length} defaultOpen={true}>
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
            </DashboardSection>
          )}

          {/* World Rules */}
          {worldRulesByCategory.size > 0 && (
            <DashboardSection title="World Rules" subtitle="Governing laws of the fiction" count={Array.from(worldRulesByCategory.values()).reduce((s, a) => s + a.length, 0)} defaultOpen={false}>
              <div className="world-rules-list">
                {Array.from(worldRulesByCategory.entries()).map(([category, rules]) => (
                  <div key={category} className="world-rule-group">
                    <span className="world-rule-category">{RULE_CATEGORY_LABELS[category] ?? category}</span>
                    {rules.map((rule) => (
                      <div key={rule.id} className="world-rule-card">
                        <span className="world-rule-name">{rule.name}</span>
                        <p className="world-rule-desc">{rule.description}</p>
                        {rule.implications.length > 0 && (
                          <ul className="world-rule-implications">
                            {rule.implications.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        )}
                        {rule.exceptions && rule.exceptions.length > 0 && (
                          <div className="world-rule-exceptions">
                            <span className="world-rule-exceptions-label">Exceptions:</span>
                            {rule.exceptions.map((exc, i) => (
                              <span key={i} className="world-rule-exception">{exc}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </DashboardSection>
          )}

          {/* Lore */}
          {loreByType.size > 0 && (
            <DashboardSection title="Lore & Traditions" subtitle="Folk tales, myths, customs, and oral traditions" count={Array.from(loreByType.values()).reduce((s, a) => s + a.length, 0)} defaultOpen={false}>
              <div className="lore-list">
                {Array.from(loreByType.entries()).map(([type, items]) => (
                  <div key={type} className="lore-group">
                    <span className="lore-type-label">{LORE_TYPE_LABELS[type] ?? type}</span>
                    {items.map((item) => (
                      <div key={item.id} className="lore-card">
                        <span className="lore-name">{item.name}</span>
                        <p className="lore-desc">{item.description}</p>
                        {item.origin_culture && (
                          <span className="lore-origin">Origin: {item.origin_culture}{item.origin_era ? ` (${item.origin_era})` : ''}</span>
                        )}
                        {item.themes && item.themes.length > 0 && (
                          <div className="lore-themes">
                            {item.themes.map((theme) => (
                              <span key={theme} className="lore-theme-tag">{theme}</span>
                            ))}
                          </div>
                        )}
                        {item.narrative_use && (
                          <p className="lore-narrative-use"><strong>Narrative use:</strong> {item.narrative_use}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </DashboardSection>
          )}

          {/* Narrative Props */}
          {filteredProps.length > 0 && (
            <DashboardSection title="Narrative Props" subtitle="Key items and devices that drive the story" count={filteredProps.length} defaultOpen={false}>
              <div className="props-list">
                {filteredProps.map((prop) => (
                  <div key={prop.id} className="prop-card">
                    <div className="prop-header">
                      <span className="prop-name">{prop.name}</span>
                      <span className="prop-function">{PROP_FUNCTION_LABELS[prop.narrative_function] ?? prop.narrative_function}</span>
                    </div>
                    <p className="prop-desc">{prop.description}</p>
                    <p className="prop-significance">{prop.plot_significance}</p>
                    {prop.arc && (
                      <span className="prop-arc">Arc: {prop.arc}</span>
                    )}
                    {prop.appears_in.length > 0 && (
                      <div className="prop-appearances">
                        <span className="prop-appearances-label">Appears in:</span>
                        {prop.appears_in.map((eid) => {
                          const target = data.entriesById.get(eid);
                          return target ? (
                            <button
                              key={eid}
                              className="prop-entry-link"
                              onClick={() => onEntrySelect(eid)}
                            >
                              {target.title}
                            </button>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DashboardSection>
          )}
        </>
      )}
    </div>
  );
}
