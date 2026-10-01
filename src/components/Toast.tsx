import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  incompleteDependencies?: { id: string; title: string; status: string }[];
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error' || toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-4 shadow-xl border transition-all duration-300 transform translate-y-0 ${
              isError
                ? 'bg-rose-950/90 text-rose-100 border-rose-800/80 backdrop-blur-md'
                : isSuccess
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/80 backdrop-blur-md'
                : 'bg-slate-900/90 text-slate-100 border-slate-700/80 backdrop-blur-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Info className="w-5 h-5 text-sky-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs mt-1 text-slate-300 leading-relaxed">
                    {toast.message}
                  </p>
                )}

                {toast.incompleteDependencies && toast.incompleteDependencies.length > 0 && (
                  <div className="mt-2.5 p-2 rounded-lg bg-black/30 border border-rose-500/20 text-xs">
                    <span className="font-medium text-rose-300 block mb-1">
                      Uncompleted Prerequisite Tasks:
                    </span>
                    <ul className="space-y-1">
                      {toast.incompleteDependencies.map((dep) => (
                        <li key={dep.id} className="flex items-center justify-between text-slate-300">
                          <span className="truncate mr-2">• {dep.title}</span>
                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {dep.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
