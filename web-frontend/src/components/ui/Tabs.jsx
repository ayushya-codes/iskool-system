export default function Tabs({ tabs, activeTab, onChange, layout = 'row' }) {
  if (layout === 'sidebar') {
    return (
      <div className="rounded-xl theme-card p-2 flex lg:flex-col gap-1 overflow-x-auto animate-fade-in">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === key ? 'gradient-bg text-white' : 'theme-text-muted hover:bg-[var(--sidebar-hover-bg)]'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex border-b border-bottom-divider overflow-x-auto">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === id
              ? 'border-[var(--accent-primary)] theme-accent bg-[var(--sidebar-hover-bg)]/50'
              : 'border-transparent theme-text-muted hover:theme-text hover:bg-[var(--sidebar-hover-bg)]'
          }`}
        >
          {Icon && <Icon className="w-4 h-4" />}
          {label}
        </button>
      ))}
    </div>
  );
}
