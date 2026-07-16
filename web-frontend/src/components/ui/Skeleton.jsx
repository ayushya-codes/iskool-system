export default function Skeleton({ type = 'text', width, height, className = '', count = 1 }) {
  const typeClass = {
    text: 'skeleton skeleton-text',
    title: 'skeleton skeleton-title',
    circle: 'skeleton skeleton-circle',
    block: 'skeleton skeleton-block',
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${typeClass[type]} ${className}`}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${typeClass[type]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl p-5 theme-card">
      <div className="flex items-center gap-4">
        <div className="skeleton skeleton-circle" style={{ width: 48, height: 48 }} />
        <div className="flex-1 space-y-2">
          <div className="skeleton skeleton-text" style={{ width: '50%' }} />
          <div className="skeleton skeleton-text" style={{ width: '30%' }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="rounded-xl overflow-hidden theme-card">
      <div className="px-4 py-3 theme-divider">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="skeleton skeleton-text flex-1" style={{ height: 16 }} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-4 py-3 theme-divider">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="skeleton skeleton-text flex-1" style={{ height: 14 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
