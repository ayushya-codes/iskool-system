import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 theme-overlay animate-fade-in" onClick={onClose} />
      <div
        className={`relative rounded-2xl theme-panel animate-scale-in ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 panel-border-bottom backdrop-blur panel-bg-solid">
          <h2 className="text-lg font-semibold theme-text">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:scale-110 theme-text-muted hover:theme-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
