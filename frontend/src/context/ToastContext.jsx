import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
let idCounter = 0;

const ICONS = {
  success: <CheckCircle2 size={18} className="text-success shrink-0" />,
  error: <XCircle size={18} className="text-danger shrink-0" />,
  info: <Info size={18} className="text-accent-500 shrink-0" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration) setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[320px] max-w-[calc(100vw-40px)]">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-start gap-2.5 bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-800 shadow-lg rounded-lg px-4 py-3"
            >
              {ICONS[t.type]}
              <p className="text-body text-gray-800 dark:text-gray-100 flex-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
