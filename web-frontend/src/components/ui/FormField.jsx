export default function FormField({ label, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium theme-text-muted mb-1">{label}</label>
      )}
      {children}
    </div>
  );
}
