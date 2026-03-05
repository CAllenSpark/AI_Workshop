import { useState, useRef, useEffect, useCallback } from 'react';
import type { TimelineEntry, LayerKey, EraKey, EntryType, ScopeKey } from '../types';
import { ERAS, LAYER_COLORS, FANTASY_LAYER_COLORS, ENTRY_TYPE_COLORS } from '../data/eras';
import './AddEntryDialog.css';

interface Props {
  onAdd: (entry: TimelineEntry) => void;
  onClose: () => void;
}

const LAYERS: { key: LayerKey; label: string }[] = [
  { key: 'event', label: 'Event' },
  { key: 'person', label: 'Person' },
  { key: 'place', label: 'Place' },
  { key: 'environment', label: 'Environment' },
];

const ENTRY_TYPES: { key: EntryType; label: string }[] = [
  { key: 'historical', label: 'Historical' },
  { key: 'fantasy', label: 'Fantasy' },
  { key: 'speculative', label: 'Speculative' },
];

const SCOPES: { key: ScopeKey; label: string }[] = [
  { key: 'vashon', label: 'Vashon Island' },
  { key: 'seattle', label: 'Seattle' },
  { key: 'tacoma', label: 'Tacoma' },
  { key: 'national', label: 'United States' },
];

function generateId(): string {
  return 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

export default function AddEntryDialog({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [era, setEra] = useState<EraKey>('modern');
  const [layers, setLayers] = useState<Set<LayerKey>>(new Set(['event']));
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState('');
  const [people, setPeople] = useState('');
  const [places, setPlaces] = useState('');
  const [entryType, setEntryType] = useState<EntryType>('historical');
  const [scope, setScope] = useState<ScopeKey>('vashon');
  const [universeId, setUniverseId] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const isFantasy = entryType === 'fantasy' || entryType === 'speculative';
  const activeLayerColors = isFantasy ? FANTASY_LAYER_COLORS : LAYER_COLORS;

  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const toggleLayer = useCallback((layer: LayerKey) => {
    setLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer) && next.size > 1) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }, []);

  const validate = useCallback((): string[] => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('Title is required');
    if (title.trim().length > 120) errs.push('Title must be 120 characters or less');
    if (!dateStart.trim()) errs.push('Start date is required');
    if (!description.trim()) errs.push('Description is required');
    if (description.trim().length > 500) errs.push('Description must be 500 characters or less');
    if (entryType === 'fantasy' && !universeId.trim()) errs.push('Universe/Campaign is required for fantasy entries');
    return errs;
  }, [title, dateStart, description, entryType, universeId]);

  const handleSubmit = useCallback(() => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const entry: TimelineEntry = {
      id: generateId(),
      title: title.trim(),
      date_start: dateStart.trim(),
      date_end: dateEnd.trim() || undefined,
      era,
      layers: Array.from(layers),
      description: description.trim(),
      details: details.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      people: people.split(',').map((p) => p.trim()).filter(Boolean),
      places: places.split(',').map((p) => p.trim()).filter(Boolean),
      sources: [],
      entry_type: entryType,
      scope,
      universe_id: isFantasy && universeId.trim() ? universeId.trim() : undefined,
    };

    // Add fantasy tag automatically for fantasy entries
    if (isFantasy && !entry.tags.includes('fantasy')) {
      entry.tags = ['fantasy', ...entry.tags];
    }

    onAdd(entry);
    onClose();
  }, [title, dateStart, dateEnd, era, layers, description, details, tags, people, places, entryType, scope, universeId, isFantasy, validate, onAdd, onClose]);

  const typeColor = ENTRY_TYPE_COLORS[entryType];

  return (
    <div className="add-entry-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Add new entry">
      <div className="add-entry-dialog" ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <div
          className="add-entry-header"
          style={isFantasy ? { borderBottomColor: typeColor.color } : undefined}
        >
          <h2>{isFantasy ? 'Add Fantasy Entry' : 'Add New Entry'}</h2>
          <button className="add-entry-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="add-entry-body">
          {errors.length > 0 && (
            <div className="add-entry-errors" role="alert">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          {/* Entry Type Selector */}
          <div className="field-row">
            <label className="field-label">Entry Type *</label>
            <div className="type-picker">
              {ENTRY_TYPES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`type-pick ${entryType === t.key ? 'active' : ''}`}
                  style={{
                    borderColor: ENTRY_TYPE_COLORS[t.key].color,
                    backgroundColor: entryType === t.key ? ENTRY_TYPE_COLORS[t.key].bg : 'transparent',
                    color: ENTRY_TYPE_COLORS[t.key].color,
                  }}
                  onClick={() => setEntryType(t.key)}
                  aria-pressed={entryType === t.key}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Selector */}
          <div className="field-row">
            <label className="field-label" htmlFor="entry-scope">Scope</label>
            <select
              id="entry-scope"
              className="field-select"
              value={scope}
              onChange={(e) => setScope(e.target.value as ScopeKey)}
            >
              {SCOPES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Universe/Campaign (fantasy only) */}
          {isFantasy && (
            <div className="field-row">
              <label className="field-label" htmlFor="entry-universe">
                Universe/Campaign {entryType === 'fantasy' ? '*' : ''}
              </label>
              <input
                id="entry-universe"
                type="text"
                className="field-input"
                value={universeId}
                onChange={(e) => setUniverseId(e.target.value)}
                placeholder="e.g., whisper-tides"
                style={{ borderColor: typeColor.color + '60' }}
              />
              <span className="field-hint">Lowercase with hyphens</span>
            </div>
          )}

          <div className="field-row">
            <label className="field-label" htmlFor="entry-title">Title *</label>
            <input
              ref={titleRef}
              id="entry-title"
              type="text"
              className="field-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isFantasy ? 'e.g., The Tidewalker Emerges' : 'e.g., Vashon Highway completed'}
              maxLength={120}
            />
            <span className="field-hint">{title.length}/120</span>
          </div>

          <div className="field-row-pair">
            <div className="field-row">
              <label className="field-label" htmlFor="entry-date-start">Start Date *</label>
              <input
                id="entry-date-start"
                type="text"
                className="field-input"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                placeholder="1920 or ~500 BCE"
              />
            </div>
            <div className="field-row">
              <label className="field-label" htmlFor="entry-date-end">End Date</label>
              <input
                id="entry-date-end"
                type="text"
                className="field-input"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="field-row">
            <label className="field-label" htmlFor="entry-era">Era *</label>
            <select
              id="entry-era"
              className="field-select"
              value={era}
              onChange={(e) => setEra(e.target.value as EraKey)}
            >
              {ERAS.map((e) => (
                <option key={e.key} value={e.key}>{e.name}</option>
              ))}
            </select>
          </div>

          <div className="field-row">
            <label className="field-label">Layers *</label>
            <div className="layer-picker">
              {LAYERS.map((l) => {
                const colors = activeLayerColors[l.key];
                return (
                  <button
                    key={l.key}
                    type="button"
                    className={`layer-pick ${layers.has(l.key) ? 'active' : ''}`}
                    style={{
                      borderColor: colors.color,
                      backgroundColor: layers.has(l.key) ? colors.bg : 'transparent',
                      color: colors.color,
                    }}
                    onClick={() => toggleLayer(l.key)}
                    aria-pressed={layers.has(l.key)}
                  >
                    {isFantasy ? colors.label : l.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field-row">
            <label className="field-label" htmlFor="entry-desc">Description *</label>
            <textarea
              id="entry-desc"
              className="field-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="1-3 sentence summary"
              rows={3}
              maxLength={500}
            />
            <span className="field-hint">{description.length}/500</span>
          </div>

          <div className="field-row">
            <label className="field-label" htmlFor="entry-details">Extended Details</label>
            <textarea
              id="entry-details"
              className="field-textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={isFantasy ? 'Narrative details, character motivations, world-building context' : 'Optional extended narrative'}
              rows={3}
            />
          </div>

          <div className="field-row">
            <label className="field-label" htmlFor="entry-tags">Tags</label>
            <input
              id="entry-tags"
              type="text"
              className="field-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated, e.g., logging, settlement"
            />
          </div>

          <div className="field-row-pair">
            <div className="field-row">
              <label className="field-label" htmlFor="entry-people">People</label>
              <input
                id="entry-people"
                type="text"
                className="field-input"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="Comma-separated names"
              />
            </div>
            <div className="field-row">
              <label className="field-label" htmlFor="entry-places">Places</label>
              <input
                id="entry-places"
                type="text"
                className="field-input"
                value={places}
                onChange={(e) => setPlaces(e.target.value)}
                placeholder="Comma-separated names"
              />
            </div>
          </div>
        </div>

        <div className="add-entry-footer">
          <button className="add-entry-cancel" onClick={onClose}>Cancel</button>
          <button
            className="add-entry-submit"
            onClick={handleSubmit}
            style={isFantasy ? { backgroundColor: typeColor.color } : undefined}
          >
            {isFantasy ? 'Add Fantasy Entry' : 'Add Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
