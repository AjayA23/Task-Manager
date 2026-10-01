import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertTriangle,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { EnrichedTask } from '../types/index.ts';

interface DependencyFlowViewProps {
  tasks: EnrichedTask[];
  onComplete: (taskId: string) => void;
  onEdit: (task: EnrichedTask) => void;
}

export const DependencyFlowView: React.FC<DependencyFlowViewProps> = ({
  tasks,
  onComplete,
  onEdit,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    tasks.find((t) => t.isBlocked)?.id || tasks[0]?.id || null
  );

  // Compute depth for topological layering
  const { levels, blockedCount } = useMemo(() => {
    const taskMap = new Map<string, EnrichedTask>();
    tasks.forEach((t) => taskMap.set(t.id, t));

    // Calculate depth for each task
    const depthMap = new Map<string, number>();

    function getDepth(taskId: string, visited = new Set<string>()): number {
      if (depthMap.has(taskId)) return depthMap.get(taskId)!;
      if (visited.has(taskId)) return 0; // prevent cycle
      visited.add(taskId);

      const task = taskMap.get(taskId);
      if (!task || task.dependencies.length === 0) {
        depthMap.set(taskId, 0);
        return 0;
      }

      let maxDepDepth = -1;
      for (const depId of task.dependencies) {
        const d = getDepth(depId, new Set(visited));
        if (d > maxDepDepth) maxDepDepth = d;
      }

      const currentDepth = maxDepDepth + 1;
      depthMap.set(taskId, currentDepth);
      return currentDepth;
    }

    tasks.forEach((t) => getDepth(t.id));

    // Group into levels
    const grouped = new Map<number, EnrichedTask[]>();
    tasks.forEach((t) => {
      const d = depthMap.get(t.id) || 0;
      if (!grouped.has(d)) grouped.set(d, []);
      grouped.get(d)!.push(t);
    });

    const sortedLevels = Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([level, items]) => ({ level, items }));

    const blockedList = tasks.filter((t) => t.isBlocked);

    return {
      levels: sortedLevels,
      blockedCount: blockedList.length,
    };
  }, [tasks]);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  // Find downstream tasks that depend on the selected task
  const dependentTasks = useMemo(() => {
    if (!selectedTaskId) return [];
    return tasks.filter((t) => t.dependencies.includes(selectedTaskId));
  }, [tasks, selectedTaskId]);

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Dependency Graph & Pipeline</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual execution order: Tasks flow from Left (Prerequisites) to Right (Dependents).
            A task is marked <span className="text-rose-400 font-semibold">BLOCKED</span> if any prerequisite task is not completed yet.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Blocked ({blockedCount})</span>
          </div>
        </div>
      </div>

      {/* Main Flow Layout + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Column Stages (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="overflow-x-auto pb-4">
            <div className="flex items-start gap-6 min-w-[700px]">
              {levels.map(({ level, items }) => (
                <div key={level} className="flex-1 flex flex-col">
                  {/* Stage Header */}
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      {level === 0 ? 'Root Tasks (No Deps)' : `Stage ${level + 1} Dependents`}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {items.length} tasks
                    </span>
                  </div>

                  {/* Nodes in this stage */}
                  <div className="space-y-3">
                    {items.map((task) => {
                      const isSelected = task.id === selectedTaskId;
                      const isDone = task.status === 'Done';

                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`relative cursor-pointer p-3.5 rounded-xl border transition-all text-left ${
                            isSelected
                              ? 'ring-2 ring-indigo-500 bg-slate-800 shadow-lg shadow-indigo-500/10 border-indigo-400'
                              : isDone
                              ? 'bg-slate-900/60 border-emerald-900/40 hover:border-emerald-700/60'
                              : task.isBlocked
                              ? 'bg-slate-900 border-rose-600/50 hover:border-rose-400 shadow-sm shadow-rose-950/20'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Top row */}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span
                              className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                                task.priority === 'High'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : task.priority === 'Medium'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-sky-500/20 text-sky-300'
                              }`}
                            >
                              {task.priority}
                            </span>

                            {isDone ? (
                              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </span>
                            ) : task.isBlocked ? (
                              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                                <AlertTriangle className="w-2.5 h-2.5" /> BLOCKED
                              </span>
                            ) : task.status === 'In Progress' ? (
                              <span className="flex items-center gap-1 text-[11px] text-sky-400 font-medium">
                                <Clock className="w-3 h-3" /> In Progress
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                <ListTodo className="w-3 h-3" /> To Do
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-semibold text-white line-clamp-2">
                            {task.title}
                          </h4>

                          {/* Dependency Summary badges */}
                          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3 text-slate-500" />
                              {task.dependencies.length > 0
                                ? `${task.dependencies.length} Prereqs`
                                : 'Independent'}
                            </span>

                            {task.assignedUser && (
                              <span className="truncate max-w-[90px] text-slate-400">
                                {task.assignedUser.name}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Task Inspector (Right Col) */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-20">
            {selectedTask ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Node Inspector
                  </span>
                  <button
                    onClick={() => onEdit(selectedTask)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Edit Task
                  </button>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {selectedTask.title}
                </h3>

                {selectedTask.description && (
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {selectedTask.description}
                  </p>
                )}

                {/* Status and Blocker Warning */}
                {selectedTask.isBlocked && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Execution Blocked!</span>
                    </div>
                    <p className="text-rose-200/90 text-[11px] leading-relaxed">
                      This task cannot be marked as Done until all prerequisite tasks are completed.
                    </p>
                  </div>
                )}

                {/* Action button */}
                <div className="mb-4">
                  {selectedTask.status === 'Done' ? (
                    <div className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <Check className="w-4 h-4" />
                      <span>Task Completed Successfully</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onComplete(selectedTask.id)}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedTask.isBlocked
                          ? 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                      }`}
                    >
                      {selectedTask.isBlocked ? (
                        <>
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span>Test Completion (Will Block)</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Complete Task Now</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Prerequisites Section */}
                <div className="mb-4 pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Prerequisites Required:</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {selectedTask.allDependenciesInfo.length} total
                    </span>
                  </h4>

                  {selectedTask.allDependenciesInfo.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      None. This task has no dependencies and can be completed anytime.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedTask.allDependenciesInfo.map((dep) => (
                        <div
                          key={dep.id}
                          onClick={() => setSelectedTaskId(dep.id)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                            dep.isCompleted
                              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-800/40 text-rose-300 hover:bg-rose-950/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            {dep.isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            )}
                            <span className="truncate">{dep.title}</span>
                          </div>

                          <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40">
                            {dep.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Downstream Tasks Section */}
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Downstream Dependents:</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {dependentTasks.length} tasks waiting
                    </span>
                  </h4>

                  {dependentTasks.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      No other tasks are waiting on this one.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {dependentTasks.map((depTask) => (
                        <div
                          key={depTask.id}
                          onClick={() => setSelectedTaskId(depTask.id)}
                          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs cursor-pointer transition-colors flex items-center justify-between text-slate-300"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">{depTask.title}</span>
                          </div>

                          <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                            {depTask.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">
                Select a task node to view its dependency tree
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
