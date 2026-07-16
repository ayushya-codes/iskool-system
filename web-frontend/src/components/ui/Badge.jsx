export default function Badge({ children, variant = 'default', dot = false, className = '' }) {
  const variants = {
    default: '',
    success: '',
    warning: '',
    danger: '',
    info: '',
  };

  const colorMap = {
    default: { bg: 'var(--badge-bg)', color: 'var(--badge-text)' },
    success: { bg: 'color-mix(in srgb, var(--success) 15%, transparent)', color: 'var(--success)' },
    warning: { bg: 'color-mix(in srgb, var(--warning) 15%, transparent)', color: 'var(--warning)' },
    danger: { bg: 'color-mix(in srgb, var(--danger) 15%, transparent)', color: 'var(--danger)' },
    info: { bg: 'color-mix(in srgb, var(--info) 15%, transparent)', color: 'var(--info)' },
  };

  const c = colorMap[variant];

  return (
    <span
      className={`theme-badge ${variants[variant]} ${className}`}
      style={{ background: c.bg, color: c.color }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />}
      {children}
    </span>
  );
}
