import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog: React.FC = () => {
  const { confirmDialog, closeConfirmDialog } = useApp();

  if (!confirmDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmDialog.isDanger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{confirmDialog.title}</h3>
                <p className="text-sm text-slate-500 mt-0.5">Please review before continuing</p>
              </div>
            </div>
            <button
              onClick={closeConfirmDialog}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-4 text-slate-600 text-sm leading-relaxed">
            {confirmDialog.message}
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeConfirmDialog}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {confirmDialog.cancelLabel || 'Cancel'}
            </button>
            <button
              type="button"
              onClick={() => {
                confirmDialog.onConfirm();
                closeConfirmDialog();
              }}
              className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-xs transition-colors cursor-pointer ${
                confirmDialog.isDanger
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                  : 'bg-blue-800 hover:bg-blue-900 shadow-blue-200'
              }`}
            >
              {confirmDialog.confirmLabel || 'Confirm Action'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
