import React, { useState } from 'react';
import {
  RotateCcw,
  Plus,
  ChevronDown,
  UserPlus,
  Check,
} from 'lucide-react';
import { User, EnrichedTask } from '../types/index.ts';

export type ActiveTab = 'dashboard' | 'my-tasks' | 'blocked' | 'flow';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  users: User[];
  tasks: EnrichedTask[];
  onSelectUser: (user: User) => void;
  onOpenNewTaskModal: () => void;
  onOpenNewUserModal: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  users,
  tasks,
  onSelectUser,
  onOpenNewTaskModal,
  onOpenNewUserModal,
  onResetDemo,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Compute counts for badges matching screenshot
  const myTasksCount = currentUser
    ? tasks.filter((t) => t.assignedTo === currentUser.id).length
    : 0;
  const blockedTasksCount = tasks.filter((t) => t.isBlocked).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Live Sync */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Smart Task Manager
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('my-tasks')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'my-tasks'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>My Tasks</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 font-mono text-slate-700">
                {myTasksCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('blocked')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'blocked'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Blocked Tasks</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-mono font-bold">
                {blockedTasksCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('flow')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'flow'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dependency Flow
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Reset Demo button */}
            <button
              onClick={onResetDemo}
              title="Reset in-memory data to default seed"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            {/* Create Task Button */}
            <button
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>

            {/* User Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm"
                  style={{ backgroundColor: currentUser?.avatarColor || '#10B981' }}
                >
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                  {currentUser ? currentUser.name : 'Aman'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-2 text-xs">
                    <div className="px-2 py-1.5 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 flex items-center justify-between">
                      <span>Switch Active User</span>
                      <span>{users.length} members</span>
                    </div>

                    <div className="py-1 max-h-56 overflow-y-auto space-y-0.5">
                      {users.map((u) => {
                        const isCurrent = currentUser?.id === u.id;
                        const userTasks = tasks.filter((t) => t.assignedTo === u.id);
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSelectUser(u);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                              isCurrent
                                ? 'bg-slate-100 text-slate-900 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] text-white shrink-0"
                                style={{ backgroundColor: u.avatarColor || '#10B981' }}
                              >
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate">
                                <div className="truncate font-semibold">{u.name}</div>
                                <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                {userTasks.length} tasks
                              </span>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenNewUserModal();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-semibold"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add New User</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('my-tasks')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'my-tasks'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500'
            }`}
          >
            My Tasks ({myTasksCount})
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'blocked'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500'
            }`}
          >
            Blocked ({blockedTasksCount})
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'flow'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500'
            }`}
          >
            Dependency Flow
          </button>
        </div>
      </div>
    </header>
  );
};
