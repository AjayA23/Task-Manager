import React from 'react';
import { Users, Mail, CheckCircle2, AlertTriangle, Clock, UserPlus, Check } from 'lucide-react';
import { User, EnrichedTask } from '../types/index.ts';

interface UsersDirectoryProps {
  users: User[];
  tasks: EnrichedTask[];
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  onOpenNewUserModal: () => void;
  onViewUserTasks: (userId: string) => void;
}

export const UsersDirectory: React.FC<UsersDirectoryProps> = ({
  users,
  tasks,
  currentUser,
  onSelectUser,
  onOpenNewUserModal,
  onViewUserTasks,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Team Members & Workloads</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registered users in the collaborative workspace. Switch active session or filter assigned tasks.
          </p>
        </div>

        <button
          onClick={onOpenNewUserModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => {
          const isCurrent = currentUser?.id === u.id;
          const assignedTasks = tasks.filter((t) => t.assignedTo === u.id);
          const completedCount = assignedTasks.filter((t) => t.status === 'Done').length;
          const inProgressCount = assignedTasks.filter((t) => t.status === 'In Progress').length;
          const blockedCount = assignedTasks.filter((t) => t.isBlocked).length;

          return (
            <div
              key={u.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-md"
                      style={{ backgroundColor: u.avatarColor || '#4F46E5' }}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{u.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[150px]">{u.email}</span>
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0">
                      Active You
                    </span>
                  )}
                </div>

                {/* Workload Metric Chips */}
                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-800/80 text-center">
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <div className="text-base font-bold font-mono text-slate-200">
                      {assignedTasks.length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Assigned</div>
                  </div>

                  <div className="bg-emerald-950/20 p-2 rounded-xl border border-emerald-900/30">
                    <div className="text-base font-bold font-mono text-emerald-400">
                      {completedCount}
                    </div>
                    <div className="text-[10px] text-emerald-300/80 mt-0.5">Completed</div>
                  </div>

                  <div className="bg-rose-950/20 p-2 rounded-xl border border-rose-900/30">
                    <div className="text-base font-bold font-mono text-rose-400">
                      {blockedCount}
                    </div>
                    <div className="text-[10px] text-rose-300/80 mt-0.5">Blocked</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => onViewUserTasks(u.id)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors text-center"
                >
                  View Tasks ({assignedTasks.length})
                </button>

                {!isCurrent && (
                  <button
                    onClick={() => onSelectUser(u)}
                    className="py-1.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all"
                  >
                    Switch to User
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
