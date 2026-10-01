import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  GitBranch,
  CheckCircle2,
  Clock,
  ListTodo,
  Check,
  User as UserIcon,
} from 'lucide-react';
import { EnrichedTask, Priority, Status, User } from '../types/index.ts';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    assignedTo: string;
    dependencies: string[];
  }) => Promise<void>;
  taskToEdit?: EnrichedTask | null;
  initialStatus?: Status;
  allTasks: EnrichedTask[];
  users: User[];
  currentUserId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  initialStatus = 'To Do',
  allTasks,
  users,
  currentUserId,
}) => {
  const isEditing = Boolean(taskToEdit);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>(initialStatus);
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when modal opens or task changes
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setAssignedTo(taskToEdit.assignedTo);
      setSelectedDependencies(taskToEdit.dependencies || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus(initialStatus);
      setAssignedTo(currentUserId || (users[0]?.id ?? ''));
      setSelectedDependencies([]);
    }
    setErrorMessage(null);
  }, [taskToEdit, initialStatus, currentUserId, users, isOpen]);

  if (!isOpen) return null;

  // Potential dependencies (exclude this task itself)
  const candidateTasks = allTasks.filter((t) => !taskToEdit || t.id !== taskToEdit.id);

  // Toggle a dependency
  const toggleDependency = (depId: string) => {
    if (selectedDependencies.includes(depId)) {
      setSelectedDependencies(selectedDependencies.filter((id) => id !== depId));
    } else {
      setSelectedDependencies([...selectedDependencies, depId]);
    }
  };

  // Check if selected status "Done" violates incomplete dependencies
  const incompleteSelectedDeps = selectedDependencies
    .map((id) => allTasks.find((t) => t.id === id))
    .filter((t) => t && t.status !== 'Done');

  const willBeBlockedIfDone = status === 'Done' && incompleteSelectedDeps.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Task title is required.');
      return;
    }

    if (status === 'Done' && incompleteSelectedDeps.length > 0) {
      setErrorMessage(
        `Cannot set status to Done: Prerequisite task "${incompleteSelectedDeps[0]?.title}" is not completed.`
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        assignedTo: assignedTo || users[0]?.id || '',
        dependencies: selectedDependencies,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify task details, priority, user assignment, and dependencies.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Build Database Schema"
              className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details, scope, or requirements..."
              className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Priority & Status (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Low">🔵 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🔴 High Priority</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Assignee
            </label>
            <div className="relative">
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dependencies Multi-select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                <span>Task Dependencies</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {selectedDependencies.length} selected
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Select tasks that must be completed before this task can be marked Done.
            </p>

            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800">
              {candidateTasks.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  No other tasks available to depend on.
                </div>
              ) : (
                candidateTasks.map((t) => {
                  const isChecked = selectedDependencies.includes(t.id);
                  const isDepDone = t.status === 'Done';

                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleDependency(t.id)}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                        isChecked
                          ? 'bg-indigo-950/50 border-indigo-500/50 text-indigo-100'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                            isChecked
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'border-slate-600 bg-slate-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="truncate font-medium">{t.title}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isDepDone ? (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Done
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Clock className="w-2.5 h-2.5" /> {t.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Dynamic Warning if status is Done but dependencies incomplete */}
          {willBeBlockedIfDone && (
            <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Dependency Rule Alert:</span>
                This task cannot be created or updated as <b>Done</b> because prerequisite task(s) like "{incompleteSelectedDeps[0]?.title}" are not completed yet.
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-md shadow-indigo-600/30 transition-all"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
