import type { TimelineEntry, DataStore } from '../types';
import { LAYER_COLORS, getEra } from '../data/eras';
import './DetailPanel.css';

interface Props {
  entry: TimelineEntry;
  data: DataStore;
  onClose: () => void;
  onEntrySelect: (id: string) => void;
}

export default function DetailPanel({ entry, data, onClose, onEntrySelect }: Props) {
  const era = getEra(entry.era);
  const primaryLayer = entry.layers[0] || 'event';
  const lc = LAYER_COLORS[primaryLayer] || LAYER_COLORS.event;

  // Resolve related people and places
  const relatedPeople = entry.people
    .map((name) => data.peopleByName.get(name))
    .filter(Boolean);
  const relatedPlaces = entry.places
    .map((name) => data.placesByName.get(name))
    .filter(Boolean);

  return (
    <aside className="detail-panel" role="complementary" aria-label="Entry details">
      {/* Header */}
      <div className="panel-header" style={{ borderBottomColor: lc.color }}>
        <button className="panel-close" onClick={onClose} aria-label="Close detail panel">
          ✕
        </button>
        <div className="panel-era" style={{ color: era?.color }}>
          {era?.name}
        </div>
        <h3 className="panel-title">{entry.title}</h3>
        <div className="panel-date">{entry.date_start}{entry.date_end ? ` – ${entry.date_end}` : ''}</div>
        <div className="panel-layers">
          {entry.layers.map((layer) => {
            const l = LAYER_COLORS[layer];
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
