export default function Input({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...rest
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium theme-text mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-text-faint" />
        )}
        <input
          className={`w-full rounded-lg px-3.5 py-2.5 text-sm theme-input ${Icon ? 'pl-10' : ''} ${error ? 'border-[var(--danger)]' : ''} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="text-xs mt-1 text-danger">{error}</p>}
      {hint && !error && <p className="text-xs mt-1 theme-text-faint">{hint}</p>}
    </div>
  );
}

export function Select({ label, children, className = '', containerClassName = '', ...rest }) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium theme-text mb-1.5">{label}</label>
      )}
      <select
        className={`w-full rounded-lg px-3.5 py-2.5 text-sm theme-input cursor-pointer ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, className = '', containerClassName = '', ...rest }) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium theme-text mb-1.5">{label}</label>
      )}
      <textarea
        className={`w-full rounded-lg px-3.5 py-2.5 text-sm theme-input ${className}`}
        {...rest}
      />
    </div>
  );
}
