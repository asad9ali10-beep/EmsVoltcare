import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none no-print">
      {toasts.map(toast => {
        let borderClass = 'border-emerald-500 bg-white text-slate-800';
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;

        if (toast.type === 'error') {
          borderClass = 'border-rose-500 bg-white text-slate-800';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
        } else if (toast.type === 'info') {
          borderClass = 'border-blue-500 bg-white text-slate-800';
          icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border-l-4 border ${borderClass} transition-all duration-200 transform translate-y-0`}
          >
            {icon}
            <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
