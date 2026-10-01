import React from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, GitBranch, Layers } from 'lucide-react';

interface WorkflowTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAndLoadDemo: () => void;
}

export const WorkflowTourModal: React.FC<WorkflowTourModalProps> = ({
  isOpen,
  onClose,
  onResetAndLoadDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dependency Logic & Example Workflow</h3>
              <p className="text-xs text-slate-400">How the dependency engine prevents premature completion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Flow */}
        <div className="mt-6 space-y-6 text-xs text-slate-300">
          {/* Visual diagram */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Core Dependency Rule:
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 w-full sm:w-auto flex-1">
                <div className="font-bold text-white text-xs">Task A: Design DB</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Status: Done ✅</div>
              </div>

              <ArrowRight className="w-4 h-4 text-indigo-400 rotate-90 sm:rotate-0 shrink-0" />

              <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/40 w-full sm:w-auto flex-1">
                <div className="font-bold text-white text-xs">Task B: Build API</div>
                <div className="text-[10px] text-sky-400 font-mono mt-0.5">Can be Completed!</div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0 shrink-0" />

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 w-full sm:w-auto flex-1">
                <div className="font-bold text-rose-300 text-xs">Task C: Frontend UI</div>
                <div className="text-[10px] text-rose-400 font-mono mt-0.5">BLOCKED until B is Done</div>
              </div>
            </div>
          </div>

          {/* Step by Step Breakdown */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Step 1 — Create Users & Tasks</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Users (John, Sarah, Alex) are created. Task A is assigned to John without dependencies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Step 2 — Attach Task Dependency</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Task B ("Build Backend API") specifies Task A as its prerequisite dependency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-950/30 border border-rose-900/50">
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div>
                <h4 className="font-bold text-rose-300 text-xs">Step 3 — Strict Block Check</h4>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  If you attempt to complete Task B while Task A is not "Done", the backend blocks the request with HTTP 400 and returns the exact list of incomplete dependencies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </div>
              <div>
                <h4 className="font-bold text-emerald-300 text-xs">Step 4 — Unlocking Downstream Work</h4>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Once Task A is marked "Done", Task B is automatically unblocked and can transition to "Done", which subsequently unlocks Task C!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onResetAndLoadDemo();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all text-center"
          >
            Load Demo Data & Try It Now
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors text-center"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
