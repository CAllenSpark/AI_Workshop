import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { TimelineEntry, DataStore, EraKey } from '../types';
import { ERAS } from '../data/eras';
import './ExportDialog.css';

type ExportScope = 'all' | 'filtered' | 'era';

interface Props {
  data: DataStore;
  filteredEntries: TimelineEntry[];
  onClose: () => void;
}

export default function ExportDialog({ data, filteredEntries, onClose }: Props) {
  const [scope, setScope] = useState<ExportScope>('all');
  const [selectedEra, setSelectedEra] = useState<EraKey>('pioneer');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);
  const [includeCoordinates, setIncludeCoordinates] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus trap and escape handling
  useEffect(() => {
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Focus trap
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

  // Build export entries based on scope
  const exportEntries = useMemo(() => {
    switch (scope) {
      case 'filtered':
        return filteredEntries;
      case 'era':
        return data.entries.filter((e) => e.era === selectedEra);
      default:
        return data.entries;
    }
  }, [scope, selectedEra, data.entries, filteredEntries]);

  // Build the export JSON
  const buildExport = useCallback(() => {
    const entryIds = new Set(exportEntries.map((e) => e.id));

    // Collect referenced people and places
    const referencedPeople = new Set<string>();
    const referencedPlaces = new Set<string>();
    for (const entry of exportEntries) {
      entry.people.forEach((p) => referencedPeople.add(p));
      entry.places.forEach((p) => referencedPlaces.add(p));
    }

    // Build era data
    const activeEraKeys = new Set(exportEntries.map((e) => e.era));
    const eras = ERAS.filter((era) => activeEraKeys.has(era.key)).map((era) => ({
      key: era.key,
      name: era.name,
      start: era.start < 0 ? `~${Math.abs(era.start)} BCE` : `${era.start}`,
      end: era.end === 2026 ? 'present' : `${era.end}`,
      context_summary: `The ${era.name} era of Vashon Island history.`,
    }));

    // Build entries with inline people/places
    const entries = exportEntries.map((entry) => {
      const people = entry.people
        .map((name) => data.peopleByName.get(name))
        .filter(Boolean)
        .map((p) => ({
          id: p!.id,
          name: p!.name,
          role: p!.role,
          description: p!.description,
        }));

      const places = entry.places
        .map((name) => data.placesByName.get(name))
        .filter(Boolean)
        .map((p) => {
          const base: Record<string, unknown> = {
            id: p!.id,
            name: p!.name,
            type: p!.type,
            description: p!.description,
          };
          if (includeCoordinates && p!.coordinates) {
            base.coordinates = p!.coordinates;
          }
          return base;
        });

      const result: Record<string, unknown> = {
        id: entry.id,
        title: entry.title,
        date_start: entry.date_start,
        era: entry.era,
        layers: entry.layers,
        description: entry.description,
        tags: entry.tags,
        people,
        places,
      };

      if (entry.date_end) result.date_end = entry.date_end;
      if (includeDetails && entry.details) result.details = entry.details;
      if (includeSources && entry.sources.length > 0) {
        result.sources = entry.sources.map((s) => ({
          title: s.title,
          type: s.type,
          ...(s.url ? { url: s.url } : {}),
        }));
      }

      return result;
    });

    // Build top-level people
    const people = data.people
      .filter((p) => referencedPeople.has(p.name))
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        role: p.role,
        related_entry_ids: (p.related_entries || []).filter((id) => entryIds.has(id)),
      }));

    // Build top-level places
    const places = data.places
      .filter((p) => referencedPlaces.has(p.name))
      .map((p) => {
        const base: Record<string, unknown> = {
          id: p.id,
          name: p.name,
          type: p.type,
          description: p.description,
          related_entry_ids: (p.related_entries || []).filter((id) => entryIds.has(id)),
        };
        if (includeCoordinates && p.coordinates) {
          base.coordinates = p.coordinates;
        }
        return base;
      });

    // Build environment features
    const environmentFeatures = data.environment.map((e) => ({
      id: e.id,
      name: e.name,
      type: e.type,
      description: e.description,
      time_relevance: e.time_relevance,
    }));

    return {
      export_metadata: {
        setting: 'Vashon Island, WA',
        generated_at: new Date().toISOString(),
        entry_count: entries.length,
        version: '1.0',
      },
      eras,
      entries,
      people,
      places,
      environment_features: environmentFeatures,
    };
  }, [exportEntries, data, includeDetails, includeSources, includeCoordinates]);

  // Estimate file size
  const estimatedSize = useMemo(() => {
    const json = JSON.stringify(buildExport());
    const bytes = new Blob([json]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, [buildExport]);

  const handleDownload = useCallback(() => {
    const json = JSON.stringify(buildExport(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `vashon-island-export-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [buildExport]);

  return (
    <div className="export-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Export knowledge base">
      <div className="export-dialog" ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <h2>Export Knowledge Base</h2>
          <button ref={closeRef} className="export-close" onClick={onClose} aria-label="Close export dialog">
            ✕
          </button>
        </div>

        <div className="export-body">
          {/* Format */}
          <div className="export-field">
            <label className="export-label">Format</label>
            <div className="export-format-badge">AI Narrator JSON</div>
          </div>

          {/* Scope */}
          <div className="export-field">
            <label className="export-label" id="scope-label">Scope</label>
            <div className="export-scope-options" role="radiogroup" aria-labelledby="scope-label">
              <label className={`scope-option ${scope === 'all' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                />
                <span>All Entries</span>
                <span className="scope-count">{data.entries.length}</span>
              </label>
              <label className={`scope-option ${scope === 'filtered' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="scope"
                  value="filtered"
                  checked={scope === 'filtered'}
                  onChange={() => setScope('filtered')}
                />
                <span>Current Filter</span>
                <span className="scope-count">{filteredEntries.length}</span>
              </label>
              <label className={`scope-option ${scope === 'era' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="scope"
                  value="era"
                  checked={scope === 'era'}
                  onChange={() => setScope('era')}
                />
                <span>Selected Era</span>
              </label>
            </div>
            {scope === 'era' && (
              <select
                className="export-era-select"
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value as EraKey)}
                aria-label="Select era to export"
              >
                {ERAS.map((era) => (
                  <option key={era.key} value={era.key}>
                    {era.name} ({data.entries.filter((e) => e.era === era.key).length} entries)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Include options */}
          <div className="export-field">
            <label className="export-label">Include</label>
            <div className="export-toggles">
              <label className="export-toggle">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                />
                <span>Extended details</span>
              </label>
              <label className="export-toggle">
                <input
                  type="checkbox"
                  checked={includeSources}
                  onChange={(e) => setIncludeSources(e.target.checked)}
                />
                <span>Source citations</span>
              </label>
              <label className="export-toggle">
                <input
                  type="checkbox"
                  checked={includeCoordinates}
                  onChange={(e) => setIncludeCoordinates(e.target.checked)}
                />
                <span>Coordinates</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="export-preview">
            <div className="preview-stat">
              <span className="preview-label">Entries</span>
              <span className="preview-value">{exportEntries.length}</span>
            </div>
            <div className="preview-stat">
              <span className="preview-label">Eras</span>
              <span className="preview-value">{new Set(exportEntries.map((e) => e.era)).size}</span>
            </div>
            <div className="preview-stat">
              <span className="preview-label">Est. Size</span>
              <span className="preview-value">{estimatedSize}</span>
            </div>
          </div>
        </div>

        <div className="export-footer">
          <button className="export-cancel" onClick={onClose}>Cancel</button>
          <button className="export-download" onClick={handleDownload}>
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}
