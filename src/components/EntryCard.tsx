import type { TimelineEntry } from '../types';
import { LAYER_COLORS } from '../data/eras';
import './EntryCard.css';

interface Props {
  entry: TimelineEntry;
  isSelected: boolean;
  onClick: () => void;
}

export default function EntryCard({ entry, isSelected, onClick }: Props) {
  const primaryLayer = entry.layers[0] || 'event';
  const lc = LAYER_COLORS[primaryLayer] || LAYER_COLORS.event;

  return (
    <article
      className={`entry-card ${isSelected ? 'selected' : ''}`}
      style={{ borderLeftColor: lc.color }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${entry.title}, ${entry.date_start}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="entry-card-header">
        <span className="entry-date" style={{ color: lc.color }}>
          {entry.date_start}
          {entry.date_end ? ` – ${entry.date_end}` : ''}
        </span>
        <div className="entry-layers">
          {entry.layers.map((layer) => {
            const l = LAYER_COLORS[layer];
            return l ? (
              <span
                key={layer}
                className="layer-dot"
                style={{ backgroundColor: l.color }}
                title={l.label}
              />
            ) : null;
          })}
        </div>
      </div>
      <h4 className="entry-title">{entry.title}</h4>
      <p className="entry-desc">{entry.description}</p>
      <div className="entry-meta">
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
      </div>
    </article>
  );
}
