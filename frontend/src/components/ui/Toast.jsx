import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = 'info') {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }

  const value = useMemo(() => ({ toasts, showToast }), [toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}

export function ToastContainer({ toasts }) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-fade-in-up rounded-lg px-4 py-2 text-sm font-medium shadow-lg ${toast.type === 'error'
            ? 'bg-red-600 text-white'
            : toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'border border-gray-600 bg-gray-800 text-white'
            }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}