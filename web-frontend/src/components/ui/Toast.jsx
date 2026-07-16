import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'var(--success)',
  error: 'var(--danger)',
  warning: 'var(--warning)',
  info: 'var(--info)',
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const api = {
    toast,
    success: (msg, dur) => toast(msg, 'success', dur),
    error: (msg, dur) => toast(msg, 'error', dur),
    warning: (msg, dur) => toast(msg, 'warning', dur),
    info: (msg, dur) => toast(msg, 'info', dur),
    remove,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const [exiting, setExiting] = useState(false);
  const Icon = icons[toast.type] || Info;
  const color = colors[toast.type] || colors.info;

  useEffect(() => {
    return () => {};
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg theme-panel animate-slide-in-left ${exiting ? 'opacity-0 translate-x-8 transition-all duration-200' : ''}`}
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color }} />
      <p className="text-sm theme-text flex-1">{toast.message}</p>
      <button onClick={handleClose} className="theme-text-faint hover:opacity-70 transition-opacity shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
