import './TabNav.css';

export type TabKey = 'timeline' | 'people' | 'narrative';

interface Props {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string; shortcut: string }[] = [
  { key: 'timeline', label: 'Timeline', shortcut: '1' },
  { key: 'people', label: 'People', shortcut: '2' },
  { key: 'narrative', label: 'Narrative', shortcut: '3' },
];

export default function TabNav({ activeTab, onChange }: Props) {
  return (
    <nav className="tab-nav" aria-label="Main views">
      <div className="tab-nav-bar" role="tablist">
        {TABS.map(({ key, label, shortcut }) => (
          <button
            key={key}
            className={`tab-btn ${activeTab === key ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === key}
            aria-controls={`panel-${key}`}
            onClick={() => onChange(key)}
            title={`${label} (${shortcut})`}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
