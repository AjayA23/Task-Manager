import React from 'react';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Flame,
  Layers,
} from 'lucide-react';
import { DashboardStats, Priority, Status } from '../types/index.ts';

interface StatsCardsProps {
  stats: DashboardStats;
  selectedStatus: Status | 'All';
  selectedPriority: Priority | 'All';
  onFilterStatus: (status: Status | 'All') => void;
  onFilterPriority: (priority: Priority | 'All') => void;
  onFilterBlocked: () => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  selectedStatus,
  selectedPriority,
  onFilterStatus,
  onFilterPriority,
  onFilterBlocked,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Total Tasks */}
      <button
        onClick={() => {
          onFilterStatus('All');
          onFilterPriority('All');
        }}
        className={`text-left p-3.5 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
          selectedStatus === 'All' && selectedPriority === 'All'
            ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10'
            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total Tasks</span>
          <Layers className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-white font-mono">
          {stats.total}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">All registered tasks</div>
      </button>

      {/* To Do */}
      <button
        onClick={() => onFilterStatus(selectedStatus === 'To Do' ? 'All' : 'To Do')}
        className={`text-left p-3.5 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
          selectedStatus === 'To Do'
            ? 'bg-slate-800/90 border-slate-400 shadow-md'
            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">To Do</span>
          <ListTodo className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-slate-200 font-mono">
          {stats.todo}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">Pending start</div>
      </button>

      {/* In Progress */}
      <button
        onClick={() =>
          onFilterStatus(selectedStatus === 'In Progress' ? 'All' : 'In Progress')
        }
        className={`text-left p-3.5 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
          selectedStatus === 'In Progress'
            ? 'bg-sky-950/40 border-sky-500 shadow-md shadow-sky-500/10'
            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">In Progress</span>
          <Clock className="w-4 h-4 text-sky-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-sky-400 font-mono">
          {stats.inProgress}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">Currently active</div>
      </button>

      {/* Completed / Done */}
      <button
        onClick={() => onFilterStatus(selectedStatus === 'Done' ? 'All' : 'Done')}
        className={`text-left p-3.5 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
          selectedStatus === 'Done'
            ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Completed</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
          {stats.done}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">All dependencies met</div>
      </button>

      {/* Blocked */}
      <button
        onClick={onFilterBlocked}
        className={`text-left p-3.5 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
          stats.blocked > 0
            ? 'bg-rose-950/30 border-rose-500/50 hover:border-rose-400 hover:bg-rose-950/50'
            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rose-300">Blocked</span>
          <AlertOctagon className="w-4 h-4 text-rose-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-rose-400 font-mono flex items-center gap-1.5">
          <span>{stats.blocked}</span>
          {stats.blocked > 0 && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
              Needs Action
            </span>
          )}
        </div>
        <div className="mt-1 text-[11px] text-rose-300/80">Pending prerequisites</div>
      </button>

      {/* High Priority */}
      <button
        onClick={() =>
          onFilterPriority(selectedPriority === 'High' ? 'All' : 'High')
        }
        className={`text-left p-3.5 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
          selectedPriority === 'High'
            ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/10'
            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">High Priority</span>
          <Flame className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 text-2xl font-bold text-amber-400 font-mono">
          {stats.highPriority}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">Urgent items</div>
      </button>
    </div>
  );
};
