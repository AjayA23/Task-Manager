import React from 'react';
import { AlertOctagon, ArrowRight, ShieldAlert, GitBranch } from 'lucide-react';
import { EnrichedTask } from '../types/index.ts';

interface BlockedBannerProps {
  blockedTasks: EnrichedTask[];
  onFocusTask: (task: EnrichedTask) => void;
  onViewFlow: () => void;
}

export const BlockedBanner: React.FC<BlockedBannerProps> = ({
  blockedTasks,
  onFocusTask,
  onViewFlow,
}) => {
  if (blockedTasks.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-rose-950/50 border border-rose-500/40 shadow-lg shadow-rose-950/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">
                {blockedTasks.length} Task{blockedTasks.length > 1 ? 's are' : ' is'} Currently Blocked
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300">
                Action Required
              </span>
            </div>
            <p className="text-xs text-rose-200/80 mt-1 max-w-2xl leading-relaxed">
              These tasks cannot transition to <b>Done</b> until their prerequisite tasks finish. Complete the prerequisite tasks first to unblock them.
            </p>
          </div>
        </div>

        <button
          onClick={onViewFlow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 text-xs font-semibold transition-all shrink-0"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Open Dependency Flow</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick list of top blocked tasks */}
      <div className="mt-3 pt-3 border-t border-rose-800/40 flex flex-wrap gap-2">
        {blockedTasks.slice(0, 4).map((task) => (
          <button
            key={task.id}
            onClick={() => onFocusTask(task)}
            className="text-left px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-rose-500/30 text-xs text-rose-200 transition-colors flex items-center gap-2"
          >
            <span className="font-medium truncate max-w-[150px]">{task.title}</span>
            <span className="text-[10px] text-rose-400/90 font-mono">
              ({task.uncompletedDependencies.length} waiting)
            </span>
          </button>
        ))}
        {blockedTasks.length > 4 && (
          <span className="text-xs text-rose-400 self-center">
            +{blockedTasks.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
};
