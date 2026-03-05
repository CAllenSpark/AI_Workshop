import type { TimelineEntry, EntryType, Universe } from '../types';
import { LAYER_COLORS, FANTASY_LAYER_COLORS, ENTRY_TYPE_COLORS } from '../data/eras';
import './EntryCard.css';

interface Props {
  entry: TimelineEntry;
  isSelected: boolean;
  onClick: () => void;
  /** Optional universe lookup map for showing universe name on creative entries */
  universesById?: Map<string, Universe>;
}

/** Get the appropriate layer color set based on entry type */
function getLayerColors(entryType: EntryType | undefined) {
  return (entryType === 'fantasy' || entryType === 'speculative')
    ? FANTASY_LAYER_COLORS
    : LAYER_COLORS;
}

export default function EntryCard({ entry, isSelected, onClick, universesById }: Props) {
  const entryType = entry.entry_type ?? 'historical';
  const isCreative = entryType === 'fantasy' || entryType === 'speculative';
  const colorSet = getLayerColors(entry.entry_type);
  const primaryLayer = entry.layers[0] || 'event';
  const lc = colorSet[primaryLayer] || colorSet.event;
  const typeMeta = ENTRY_TYPE_COLORS[entryType];

  return (
    <article
      className={`entry-card ${isSelected ? 'selected' : ''} ${isCreative ? 'creative' : ''} ${entryType === 'speculative' ? 'speculative' : ''}`}
      style={{
        borderLeftColor: lc.color,
        ...(isCreative ? { backgroundColor: 'var(--creative-surface)' } : {}),
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${entry.title}, ${entry.date_start}${isCreative ? `, ${entryType}` : ''}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      data-entry-type={entryType}
    >
      <div className="entry-card-header">
        <span className="entry-date" style={{ color: lc.color }}>
          {entry.date_start}
          {entry.date_end ? ` – ${entry.date_end}` : ''}
        </span>
        <div className="entry-card-badges">
          {isCreative && typeMeta && (
            <span
              className="entry-type-badge"
              style={{ backgroundColor: typeMeta.color, color: '#fff' }}
            >
              {typeMeta.label}
            </span>
          )}
          <div className="entry-layers">
            {entry.layers.map((layer) => {
              const l = colorSet[layer];
              return l ? (
                <span
                  key={layer}
                  className={`layer-dot ${isCreative ? 'creative' : ''}`}
                  style={{ backgroundColor: l.color }}
                  title={l.label}
                />
              ) : null;
            })}
          </div>
        </div>
      </div>
      <h4 className="entry-title">{entry.title}</h4>
      <p className="entry-desc">{entry.description}</p>
      <div className="entry-meta">
        {isCreative && entry.universe_id && universesById && (() => {
          const universe = universesById.get(entry.universe_id);
          return universe ? (
            <span className="meta-badge universe">{universe.name}</span>
          ) : null;
        })()}
        {isCreative && entry.narrative?.arc && (
          <span className="meta-badge arc">{entry.narrative.arc}</span>
        )}
        {isCreative && entry.narrative?.beat && (
          <span className="meta-badge beat">{entry.narrative.beat.replace(/-/g, ' ')}</span>
        )}
        {entry.people.length > 0 && (
          <span className="meta-badge people">
            {entry.people.length} {entry.people.length === 1 ? 'person' : 'people'}
          </span>
        )}
        {entry.places.length > 0 && (
          <span className="meta-badge places">
            {entry.places.length} {entry.places.length === 1 ? 'place' : 'places'}
          </span>
        )}
        {entry.sources.length > 0 && (
          <span className="meta-badge sources">
            {entry.sources.length} {entry.sources.length === 1 ? 'source' : 'sources'}
          </span>
        )}
        {entry.scope && entry.scope !== 'vashon' && (
          <span className="meta-badge scope">
            {entry.scope === 'seattle' ? 'Seattle' : entry.scope === 'tacoma' ? 'Tacoma' : 'National'}
          </span>
        )}
      </div>
    </article>
  );
}
