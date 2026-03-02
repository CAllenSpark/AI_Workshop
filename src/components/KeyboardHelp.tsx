import { useEffect, useRef } from 'react';
import './KeyboardHelp.css';

interface Props {
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['/', ''], label: 'Focus search' },
  { keys: ['Esc'], label: 'Close panel / Clear search' },
  { keys: ['?'], label: 'Toggle this help' },
  { keys: ['E'], label: 'Open export dialog' },
  { keys: ['N'], label: 'Add new entry' },
  { keys: ['\u2190', '\u2192'], label: 'Scrub timeline left / right' },
  { keys: ['+'], label: 'Zoom in' },
  { keys: ['\u2212'], label: 'Zoom out' },
];

export default function KeyboardHelp({ onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="help-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <div className="help-dialog" ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>Keyboard Shortcuts</h2>
          <button className="help-close" onClick={onClose} aria-label="Close help">
            ✕
          </button>
        </div>
        <div className="help-body">
          <table className="shortcuts-table" role="presentation">
            <tbody>
              {SHORTCUTS.map((s, i) => (
                <tr key={i}>
                  <td className="shortcut-keys">
                    {s.keys.map((k, j) => (
                      <span key={j}>
                        {j > 0 && <span className="key-separator"> </span>}
                        <kbd>{k}</kbd>
                      </span>
                    ))}
                  </td>
                  <td className="shortcut-label">{s.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="help-footer">
          <span>Press <kbd>?</kbd> to dismiss</span>
        </div>
      </div>
    </div>
  );
}
