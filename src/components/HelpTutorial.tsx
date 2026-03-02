import { useState, useEffect, useRef, useCallback } from 'react';
import './HelpTutorial.css';

interface Props {
  onDismiss: () => void;
}

const STEPS = [
  {
    title: 'Welcome to the Writer\'s Research Companion',
    body: 'This tool helps you explore the history, people, places, and environment of Vashon Island across thousands of years. Let\'s take a quick tour.',
    target: null,
  },
  {
    title: 'Timeline',
    body: 'The interactive timeline shows events across time. Drag to scrub through history, scroll to zoom between Era, Century, Decade, and Year views. Click any marker to see details.',
    target: '.timeline-track',
  },
  {
    title: 'Search',
    body: 'Type at least 2 characters to search across all entries, people, places, and tags. Press / from anywhere to jump to the search bar.',
    target: '.search-input',
  },
  {
    title: 'Filters',
    body: 'Toggle data layers (Events, People, Places, Environment), select specific eras, or narrow the date range. All filters combine with AND logic.',
    target: '.filter-panel',
  },
  {
    title: 'Entry Cards',
    body: 'Each card shows a timeline entry with its date, layer badges, description, and related people/places. Click a card to open the full detail panel.',
    target: '.entry-list',
  },
  {
    title: 'Export',
    body: 'Click Export (or press E) to download the knowledge base as JSON for AI narrators. Choose scope, toggle details and sources, then download.',
    target: '.export-btn',
  },
  {
    title: 'Add New Entries',
    body: 'Click the + button (or press N) to add your own research entries. New entries appear in the timeline immediately.',
    target: '.add-entry-btn',
  },
  {
    title: 'Keyboard Shortcuts',
    body: 'Press ? at any time to see all keyboard shortcuts. Use arrow keys on the timeline, +/- to zoom, Tab to navigate entries, Escape to close panels.',
    target: '.help-btn',
  },
  {
    title: 'You\'re all set!',
    body: 'Start exploring by clicking an era on the timeline or searching for a topic. You can always reopen this tutorial from the help menu.',
    target: null,
  },
];

const STORAGE_KEY = 'wrc_tutorial_seen';

export function useTutorialState() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setShow(true);
  }, []);

  const dismiss = useCallback(() => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, '1');
  }, []);

  const reopen = useCallback(() => {
    setShow(true);
  }, []);

  return { showTutorial: show, dismissTutorial: dismiss, reopenTutorial: reopen };
}

export default function HelpTutorial({ onDismiss }: Props) {
  const [step, setStep] = useState(0);
  const [highlight, setHighlight] = useState<DOMRect | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const currentStep = STEPS[step];

  // Highlight target element
  useEffect(() => {
    if (!currentStep.target) {
      setHighlight(null);
      return;
    }
    const el = document.querySelector(currentStep.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setHighlight(rect);
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      setHighlight(null);
    }
  }, [step, currentStep.target]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (step < STEPS.length - 1) setStep((s) => s + 1);
        else onDismiss();
      }
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, onDismiss]);

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-label="Welcome tutorial">
      {/* Highlight ring around target element */}
      {highlight && (
        <div
          className="tutorial-highlight"
          style={{
            top: highlight.top - 6,
            left: highlight.left - 6,
            width: highlight.width + 12,
            height: highlight.height + 12,
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        className="tutorial-card"
        ref={dialogRef}
        style={highlight ? {
          top: Math.min(highlight.bottom + 16, window.innerHeight - 260),
          left: Math.max(16, Math.min(highlight.left, window.innerWidth - 400)),
        } : undefined}
      >
        <div className="tutorial-step-indicator">
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
          ))}
        </div>

        <h3 className="tutorial-title">{currentStep.title}</h3>
        <p className="tutorial-body">{currentStep.body}</p>

        <div className="tutorial-actions">
          <button className="tutorial-skip" onClick={onDismiss}>
            Skip Tour
          </button>
          <div className="tutorial-nav">
            {step > 0 && (
              <button className="tutorial-prev" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="tutorial-next" onClick={() => setStep((s) => s + 1)}>
                Next
              </button>
            ) : (
              <button className="tutorial-next" onClick={onDismiss}>
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
