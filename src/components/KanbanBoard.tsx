import React from 'react';
import { Plus, ListTodo, Clock, CheckCircle2 } from 'lucide-react';
import { EnrichedTask, Status } from '../types/index.ts';
import { TaskCard } from './TaskCard.tsx';

interface KanbanBoardProps {
  tasks: EnrichedTask[];
  onComplete: (taskId: string) => void;
  onEdit: (task: EnrichedTask) => void;
  onDelete: (taskId: string) => void;
  onOpenNewTaskModalWithStatus: (status: Status) => void;
  currentUserId?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onComplete,
  onEdit,
  onDelete,
  onOpenNewTaskModalWithStatus,
  currentUserId,
}) => {
  const columns: { status: Status; title: string; icon: React.ReactNode; color: string }[] = [
    {
      status: 'To Do',
      title: 'To Do',
      icon: <ListTodo className="w-4 h-4 text-slate-400" />,
      color: 'border-slate-700 bg-slate-900/40',
    },
    {
      status: 'In Progress',
      title: 'In Progress',
      icon: <Clock className="w-4 h-4 text-sky-400" />,
      color: 'border-sky-900/50 bg-sky-950/20',
    },
    {
      status: 'Done',
      title: 'Done',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-900/50 bg-emerald-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        const blockedInCol = colTasks.filter((t) => t.isBlocked).length;

        return (
          <div
            key={col.status}
            className={`rounded-2xl border p-4 flex flex-col min-h-[500px] ${col.color}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="font-semibold text-sm text-slate-200">{col.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300">
                  {colTasks.length}
                </span>
                {blockedInCol > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {blockedInCol} blocked
                  </span>
                )}
              </div>

              <button
                onClick={() => onOpenNewTaskModalWithStatus(col.status)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {colTasks.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-center p-4">
                  <p className="text-xs text-slate-500">No tasks in this column</p>
                  <button
                    onClick={() => onOpenNewTaskModalWithStatus(col.status)}
                    className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    + Add a task
                  </button>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isMyTask={task.assignedTo === currentUserId}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
