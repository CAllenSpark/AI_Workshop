import type { TimelineEntry, DataStore } from '../types';
import { LAYER_COLORS, FANTASY_LAYER_COLORS, ENTRY_TYPE_COLORS, getEra } from '../data/eras';
import './DetailPanel.css';

interface Props {
  entry: TimelineEntry;
  data: DataStore;
  onClose: () => void;
  onEntrySelect: (id: string) => void;
}

export default function DetailPanel({ entry, data, onClose, onEntrySelect }: Props) {
  const era = getEra(entry.era);
  const entryType = entry.entry_type ?? 'historical';
  const isCreative = entryType === 'fantasy' || entryType === 'speculative';
  const colorSet = isCreative ? FANTASY_LAYER_COLORS : LAYER_COLORS;
  const primaryLayer = entry.layers[0] || 'event';
  const lc = colorSet[primaryLayer] || colorSet.event;
  const typeMeta = ENTRY_TYPE_COLORS[entryType];

  // Resolve related people and places
  const relatedPeople = entry.people
    .map((name) => data.peopleByName.get(name))
    .filter(Boolean);
  const relatedPlaces = entry.places
    .map((name) => data.placesByName.get(name))
    .filter(Boolean);

  // Resolve narrative anchors
  const anchors = entry.narrative?.anchors?.map((anchor) => {
    const anchorEntry = data.entriesById.get(anchor.entry_id);
    return { ...anchor, entry: anchorEntry };
  }).filter((a) => a.entry) ?? [];

  return (
    <aside className={`detail-panel ${isCreative ? 'creative' : ''}`} role="complementary" aria-label="Entry details">
      {/* Header */}
      <div className="panel-header" style={{ borderBottomColor: lc.color }}>
        <button className="panel-close" onClick={onClose} aria-label="Close detail panel">
          ✕
        </button>
        <div className="panel-header-top">
          <div className="panel-era" style={{ color: era?.color }}>
            {era?.name}
          </div>
          {isCreative && typeMeta && (
            <span
              className="panel-type-badge"
              style={{ backgroundColor: typeMeta.color, color: '#fff' }}
            >
              {typeMeta.label}
            </span>
          )}
        </div>
        <h3 className="panel-title">{entry.title}</h3>
        <div className="panel-date">{entry.date_start}{entry.date_end ? ` – ${entry.date_end}` : ''}</div>
        <div className="panel-layers">
          {entry.layers.map((layer) => {
            const l = colorSet[layer];
            return l ? (
              <span key={layer} className="panel-layer-badge" style={{ backgroundColor: l.bg, color: l.color }}>
                {l.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* Content */}
      <div className="panel-content">
        <p className="panel-description">{entry.description}</p>

        {entry.details && (
          <div className="panel-details">
            <h4>Details</h4>
            <p>{entry.details}</p>
          </div>
        )}

        {/* People */}
        {relatedPeople.length > 0 && (
          <div className="panel-section">
            <h4 style={{ color: LAYER_COLORS.person.color }}>People</h4>
            <ul className="panel-list">
              {relatedPeople.map((person) =>
                person ? (
                  <li key={person.id} className="panel-person">
                    <strong>{person.name}</strong>
                    <span className="person-role">{person.role}</span>
                    {person.related_entries && person.related_entries.length > 1 && (
                      <div className="related-links">
                        {person.related_entries
                          .filter((eid) => eid !== entry.id)
                          .slice(0, 3)
                          .map((eid) => {
                            const related = data.entriesById.get(eid);
                            return related ? (
                              <button
                                key={eid}
                                className="related-link"
                                onClick={() => onEntrySelect(eid)}
                              >
                                {related.title}
                              </button>
                            ) : null;
                          })}
                      </div>
                    )}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}

        {/* Places */}
        {relatedPlaces.length > 0 && (
          <div className="panel-section">
            <h4 style={{ color: LAYER_COLORS.place.color }}>Places</h4>
            <ul className="panel-list">
              {relatedPlaces.map((place) =>
                place ? (
                  <li key={place.id} className="panel-place">
                    <strong>{place.name}</strong>
                    <span className="place-type">{place.type}</span>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}

        {/* Narrative metadata (creative entries) */}
        {entry.narrative && (entry.narrative.arc || entry.narrative.beat || anchors.length > 0) && (
          <div className="panel-section panel-narrative">
            <h4 style={{ color: 'var(--creative-primary)' }}>Narrative</h4>
            {entry.narrative.arc && (
              <div className="narrative-field">
                <span className="narrative-label">Arc:</span>
                <span className="narrative-value">{entry.narrative.arc}</span>
              </div>
            )}
            {entry.narrative.beat && (
              <div className="narrative-field">
                <span className="narrative-label">Beat:</span>
                <span className="narrative-beat-badge">{entry.narrative.beat.replace(/-/g, ' ')}</span>
              </div>
            )}
            {anchors.length > 0 && (
              <div className="narrative-anchors">
                <span className="narrative-label">Anchored to:</span>
                {anchors.map((anchor) => (
                  <button
                    key={anchor.entry_id}
                    className="anchor-link"
                    onClick={() => onEntrySelect(anchor.entry_id)}
                    title={anchor.description}
                  >
                    <span className="anchor-relationship">{anchor.relationship.replace(/_/g, ' ')}</span>
                    {anchor.entry?.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="panel-section">
            <h4>Tags</h4>
            <div className="panel-tags">
              {entry.tags.map((tag) => (
                <span key={tag} className="panel-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {entry.sources.length > 0 && (
          <div className="panel-section">
            <h4>Sources</h4>
            <ul className="panel-sources">
              {entry.sources.map((src, i) => (
                <li key={i} className="panel-source">
                  <span className={`source-type ${src.type}`}>{src.type}</span>
                  {src.url ? (
                    <a href={src.url} target="_blank" rel="noopener noreferrer">
                      {src.title}
                    </a>
                  ) : (
                    <span>{src.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
