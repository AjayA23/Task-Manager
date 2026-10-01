import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, EnrichedTask, Priority, Status, DashboardStats } from './types/index.ts';
import { api } from './api/client.ts';
import { Navbar, ActiveTab } from './components/Navbar.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { TaskCard } from './components/TaskCard.tsx';
import { DependencyFlowView } from './components/DependencyFlowView.tsx';
import { TaskModal } from './components/TaskModal.tsx';
import { UserModal } from './components/UserModal.tsx';
import { WorkflowTourModal } from './components/WorkflowTourModal.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';

export default function App() {
  // --- Data State ---
  const [tasks, setTasks] = useState<EnrichedTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- UI & Filter State ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');

  // --- Modals State ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<EnrichedTask | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isWorkflowTourOpen, setIsWorkflowTourOpen] = useState(false);

  // --- Toasts State ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  // --- Data Fetching ---
  const refreshData = useCallback(async () => {
    try {
      const [fetchedTasks, fetchedUsers] = await Promise.all([
        api.getTasks(),
        api.getUsers(),
      ]);

      setTasks(fetchedTasks);
      setUsers(fetchedUsers);

      setCurrentUser((prevUser) => {
        if (prevUser && fetchedUsers.some((u) => u.id === prevUser.id)) {
          return fetchedUsers.find((u) => u.id === prevUser.id) || prevUser;
        }
        return fetchedUsers[0] || null;
      });
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      addToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to backend server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // --- Task Operations ---
  const handleCompleteTask = async (taskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    try {
      await api.completeTask(taskId);
      addToast({
        type: 'success',
        title: 'Task Completed',
        message: `"${targetTask?.title || 'Task'}" has been marked as Done!`,
      });
      refreshData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Execution Blocked by Dependencies!',
        message: err.message || 'Task cannot be completed yet.',
        incompleteDependencies: err.incompleteDependencies || targetTask?.uncompletedDependencies,
      });
    }
  };

  const handleCreateOrUpdateTask = async (data: {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    assignedTo: string;
    dependencies: string[];
  }) => {
    if (taskToEdit) {
      await api.updateTask(taskToEdit.id, data);
      addToast({
        type: 'success',
        title: 'Task Updated',
        message: `"${data.title}" was saved successfully.`,
      });
    } else {
      await api.createTask(data);
      addToast({
        type: 'success',
        title: 'Task Created',
        message: `"${data.title}" has been created.`,
      });
    }
    refreshData();
  };

  const handleDeleteTask = async (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    try {
      await api.deleteTask(taskId);
      addToast({
        type: 'info',
        title: 'Task Deleted',
        message: `"${target?.title || 'Task'}" removed from workspace.`,
      });
      refreshData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    }
  };

  const handleResetDemo = async () => {
    try {
      await api.resetDemo();
      addToast({
        type: 'info',
        title: 'Demo Data Reset',
        message: 'In-memory database has been reset to the default demo state.',
      });
      refreshData();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Reset Failed',
        message: err.message,
      });
    }
  };

  // --- Filtering Logic ---
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Tab filter
      if (activeTab === 'my-tasks') {
        if (!currentUser || task.assignedTo !== currentUser.id) return false;
      } else if (activeTab === 'blocked') {
        if (!task.isBlocked) return false;
      }

      // Priority filter
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;

      // Status filter
      if (statusFilter !== 'All' && task.status !== statusFilter) return false;

      return true;
    });
  }, [tasks, activeTab, priorityFilter, statusFilter, currentUser]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        users={users}
        tasks={tasks}
        onSelectUser={(u) => {
          setCurrentUser(u);
          addToast({
            type: 'info',
            title: 'User Switched',
            message: `Active session changed to ${u.name}.`,
          });
        }}
        onOpenNewTaskModal={() => {
          setTaskToEdit(null);
          setIsTaskModalOpen(true);
        }}
        onOpenNewUserModal={() => setIsUserModalOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Render Tab Contents */}
        {activeTab === 'flow' ? (
          <DependencyFlowView
            tasks={tasks}
            onComplete={handleCompleteTask}
            onEdit={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
          />
        ) : (
          <div>
            {/* Filter Bar */}
            <FilterBar
              priority={priorityFilter}
              setPriority={setPriorityFilter}
              status={statusFilter}
              setStatus={setStatusFilter}
            />

            {/* Task Cards Grid */}
            {isLoading ? (
              <div className="py-20 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs">Loading tasks and resolving dependencies...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
                <h3 className="font-bold text-slate-800 text-base">No tasks match your criteria</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {activeTab === 'my-tasks'
                    ? `No tasks currently assigned to ${currentUser?.name || 'this user'}.`
                    : activeTab === 'blocked'
                    ? 'No blocked tasks! All prerequisite dependencies are currently fulfilled.'
                    : 'Try clearing filters to view all tasks.'}
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setPriorityFilter('All');
                      setStatusFilter('All');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => {
                      setTaskToEdit(null);
                      setIsTaskModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white shadow-sm"
                  >
                    + Create Task
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onEdit={(t) => {
                      setTaskToEdit(t);
                      setIsTaskModalOpen(true);
                    }}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Smart Task Manager</span>
            <span>•</span>
            <span>In-Memory Collaborative System</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Node.js Express REST API + Next.js / React
          </div>
        </div>
      </footer>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
        allTasks={tasks}
        users={users}
        currentUserId={currentUser?.id}
      />

      {/* User Create / Login Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onUserCreated={(newUser) => {
          setUsers((prev) => [...prev, newUser]);
          setCurrentUser(newUser);
          addToast({
            type: 'success',
            title: 'User Registered',
            message: `Welcome, ${newUser.name}!`,
          });
        }}
        onLogin={api.login}
        existingUsers={users}
        onSelectUser={(u) => {
          setCurrentUser(u);
          addToast({
            type: 'info',
            title: 'Logged In',
            message: `Logged in as ${u.name}`,
          });
        }}
      />

      {/* Interactive Workflow Guide Modal */}
      <WorkflowTourModal
        isOpen={isWorkflowTourOpen}
        onClose={() => setIsWorkflowTourOpen(false)}
        onResetAndLoadDemo={handleResetDemo}
      />
    </div>
  );
}
