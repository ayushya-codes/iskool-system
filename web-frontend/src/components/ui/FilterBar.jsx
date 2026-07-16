export default function FilterBar({ children, className = '' }) {
  return (
    <div className={`rounded-xl theme-card p-4 mb-6 animate-fade-in ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
}

export function FilterSelect({ label, value, onChange, children, disabled }) {
  return (
    <div>
      <label className="block text-xs font-medium theme-text-muted mb-1.5">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-lg px-3 py-2 text-sm theme-input cursor-pointer disabled:opacity-50"
      >
        {children}
      </select>
    </div>
  );
}
