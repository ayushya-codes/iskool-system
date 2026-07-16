import { Inbox } from 'lucide-react';

export default function EmptyState({ message = 'No data available.', icon: Icon, className = '' }) {
  const I = Icon || Inbox;
  return (
    <div className={`rounded-xl theme-card p-12 text-center ${className}`}>
      <I className="w-10 h-10 mx-auto mb-3 theme-text-faint" />
      <p className="text-sm theme-text-muted">{message}</p>
    </div>
  );
}
