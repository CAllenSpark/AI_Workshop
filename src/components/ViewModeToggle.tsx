import type { EntryType } from '../types';
import { ENTRY_TYPE_COLORS } from '../data/eras';
import './ViewModeToggle.css';

export type ViewMode = 'historical' | 'creative' | 'all';

interface Props {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  counts: Record<EntryType | 'creative' | 'all', number>;
}

const MODES: { key: ViewMode; label: string; description: string }[] = [
  { key: 'historical', label: 'Historical', description: 'Verified historical entries only' },
  { key: 'creative', label: 'Creative', description: 'Fantasy and speculative entries' },
  { key: 'all', label: 'All', description: 'All entries combined' },
];

export default function ViewModeToggle({ viewMode, onChange, counts }: Props) {
  return (
    <div className="view-mode-toggle" role="radiogroup" aria-label="View mode">
      {MODES.map(({ key, label, description }) => {
        const isActive = viewMode === key;
        const color = key === 'all'
          ? 'var(--charcoal)'
          : key === 'creative'
            ? 'var(--creative-primary)'
            : ENTRY_TYPE_COLORS.historical.color;

        return (
          <button
            key={key}
            className={`view-mode-btn ${isActive ? 'active' : ''}`}
            role="radio"
            aria-checked={isActive}
            aria-label={description}
            title={description}
            onClick={() => onChange(key)}
            style={{
              '--mode-color': color,
            } as React.CSSProperties}
          >
            <span className="view-mode-label">{label}</span>
            <span className="view-mode-count">{counts[key] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
