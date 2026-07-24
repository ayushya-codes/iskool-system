import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 theme-overlay animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={`relative rounded-2xl theme-panel animate-scale-in ${maxWidth} w-full max-h-[80vh] flex flex-col`}
          >
            <div className="flex-none flex items-center justify-between px-6 py-4 panel-border-bottom backdrop-blur panel-bg-solid">
              <h2 className="text-lg font-semibold theme-text">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-all hover:scale-110 theme-text-muted hover:theme-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto min-h-0">{children}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
