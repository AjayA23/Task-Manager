import React from 'react';
import {
  Check,
  Clock,
  Lock,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { EnrichedTask } from '../types/index.ts';

interface TaskCardProps {
  task: EnrichedTask;
  onComplete: (taskId: string) => void;
  onEdit: (task: EnrichedTask) => void;
  onDelete: (taskId: string) => void;
  isMyTask?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const isDone = task.status === 'Done';
  const isBlocked = task.isBlocked && !isDone;
  const isReady = !isBlocked && !isDone;

  const priorityColor =
    task.priority === 'High'
      ? 'text-rose-600 bg-rose-50 border-rose-200'
      : task.priority === 'Medium'
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-sky-600 bg-sky-50 border-sky-200';

  const statusColor =
    task.status === 'Done'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : task.status === 'In Progress'
      ? 'text-sky-700 bg-sky-50 border-sky-200'
      : 'text-slate-600 bg-slate-100 border-slate-200';

  return (
    <div
      className={`rounded-2xl border bg-white p-5 flex flex-col justify-between transition-all shadow-sm hover:shadow-md ${
        isBlocked
          ? 'border-amber-400 ring-1 ring-amber-300/40'
          : 'border-slate-200'
      }`}
    >
      <div>
        {/* Top Badges & Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityColor}`}
            >
              {task.priority} Priority
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}
            >
              {task.status}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {task.date || 'Jan 16'}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-base leading-snug mb-2 ${
            isDone ? 'line-through text-slate-400' : 'text-slate-800'
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            {task.description}
          </p>
        )}

        {/* Prerequisites status line */}
        {task.dependencies && task.dependencies.length > 0 && (
          <div className="flex items-center justify-between text-xs font-medium pt-2 pb-1 border-t border-slate-100">
            <span className="text-slate-600">
              Prerequisites: {task.dependencies.length} task{task.dependencies.length > 1 ? 's' : ''}
            </span>

            {isDone ? (
              <span className="text-emerald-600 font-semibold">Completed</span>
            ) : isBlocked ? (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Blocked
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Ready
              </span>
            )}
          </div>
        )}

        {/* Must be completed first alert box */}
        {isBlocked && task.uncompletedDependencies && task.uncompletedDependencies.length > 0 && (
          <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-normal">
            <div className="font-semibold flex items-center gap-1.5 text-amber-800 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Must be completed first:</span>
            </div>
            <ul className="space-y-1 pl-1">
              {task.uncompletedDependencies.map((dep) => (
                <li key={dep.id} className="text-[11px] text-amber-900">
                  • {dep.title}{' '}
                  <span className="text-amber-700 font-medium">({dep.status})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer: User Avatar & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0"
            style={{ backgroundColor: task.assignedUser?.avatarColor || '#10B981' }}
          >
            {task.assignedUser?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[100px]">
            {task.assignedUser?.name || 'Unassigned'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isDone ? (
            <button
              disabled
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 cursor-default"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          ) : isBlocked ? (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => onComplete(task.id)}
                title="Prerequisites not completed yet - click to view warning"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Blocked</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => onComplete(task.id)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Done</span>
              </button>
            </div>
          )}

          {/* Edit & Delete */}
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
            title="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
