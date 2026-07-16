export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  style,
  ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'gradient-bg-hover text-white',
    secondary: 'glass-btn theme-text',
    ghost: 'theme-text-muted hover:bg-[var(--sidebar-hover-bg)]',
    danger: 'text-white hover:opacity-90',
    outline: 'theme-input hover:border-[var(--accent-primary)]',
  };

  const dangerStyle = variant === 'danger' ? { background: 'var(--danger)' } : {};

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={{ ...dangerStyle, ...style }}
      {...rest}
    >
      {loading && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />}
      {!loading && Icon && iconPosition === 'left' && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
    </button>
  );
}
