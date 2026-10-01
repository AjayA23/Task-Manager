/**
 * Shared Type Definitions for Smart Task Manager
 */

export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'To Do' | 'In Progress' | 'Done';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignedTo: string; // User ID
  dependencies: string[]; // List of Task IDs this task depends on
  date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyInfo {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  isCompleted: boolean;
}

export interface EnrichedTask extends Task {
  isBlocked: boolean;
  uncompletedDependencies: DependencyInfo[];
  allDependenciesInfo: DependencyInfo[];
  assignedUser?: User;
  dependentsCount?: number; // How many other tasks depend on this task
}

export interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  blocked: number;
  highPriority: number;
}
