export default function LoadingText({ text = 'Loading...', size = 16, className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="spinner" style={{ width: size, height: size, borderWidth: 2 }} />
      <span className="text-sm theme-text-muted">{text}</span>
    </div>
  );
}
