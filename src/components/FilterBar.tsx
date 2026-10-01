import React from 'react';
import { Priority, Status } from '../types/index.ts';

interface FilterBarProps {
  priority: Priority | 'All';
  setPriority: (val: Priority | 'All') => void;
  status: Status | 'All';
  setStatus: (val: Status | 'All') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  priority,
  setPriority,
  status,
  setStatus,
}) => {
  const priorities: (Priority | 'All')[] = ['All', 'High', 'Medium', 'Low'];
  const statuses: (Status | 'All')[] = ['All', 'To Do', 'In Progress', 'Done'];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 px-5 mb-6 flex flex-wrap items-center gap-6 shadow-sm">
      {/* Priority Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Priority:</span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {priorities.map((p) => {
            const isSelected = priority === p;
            return (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Status:</span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {statuses.map((s) => {
            const isSelected = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
