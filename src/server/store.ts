import { Task, User, EnrichedTask, DependencyInfo, Priority, Status } from '../types/index.ts';

// In-Memory Storage Maps
const usersMap = new Map<string, User>();
const tasksMap = new Map<string, Task>();

export function seedDefaultData(): void {
  usersMap.clear();
  tasksMap.clear();

  // Seed Team matching the UI Screenshot: Aman, Abhay, Ajay, Narayan, shorya
  const user1: User = {
    id: 'user-1',
    name: 'Aman',
    email: 'aman@example.com',
    avatarColor: '#10B981', // Emerald green
    createdAt: new Date().toISOString(),
  };

  const user2: User = {
    id: 'user-2',
    name: 'Abhay',
    email: 'abhay@example.com',
    avatarColor: '#0284C7', // Sky Blue
    createdAt: new Date().toISOString(),
  };

  const user3: User = {
    id: 'user-3',
    name: 'Ajay',
    email: 'ajay@example.com',
    avatarColor: '#7C3AED', // Purple
    createdAt: new Date().toISOString(),
  };

  const user4: User = {
    id: 'user-4',
    name: 'Narayan',
    email: 'narayan@example.com',
    avatarColor: '#EA580C', // Orange
    createdAt: new Date().toISOString(),
  };

  const user5: User = {
    id: 'user-5',
    name: 'shorya',
    email: 'shorya@example.com',
    avatarColor: '#DC2626', // Red
    createdAt: new Date().toISOString(),
  };

  usersMap.set(user1.id, user1);
  usersMap.set(user2.id, user2);
  usersMap.set(user3.id, user3);
  usersMap.set(user4.id, user4);
  usersMap.set(user5.id, user5);

  // Exact 5 seed tasks from user screenshot
  const task1: Task = {
    id: 'task-1',
    title: 'Design In-Memory Architecture & Schema',
    description: 'Map out data models for Users, Tasks, and the dependency validation pipeline.',
    priority: 'High',
    status: 'Done',
    assignedTo: user1.id, // Aman
    dependencies: [],
    createdAt: new Date('2026-01-15T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-15T12:00:00Z').toISOString(),
  };

  const task2: Task = {
    id: 'task-2',
    title: 'Implement Authentication & User Directory',
    description: 'Provide session registration, login, and user listing APIs for the team.',
    priority: 'Medium',
    status: 'Done',
    assignedTo: user2.id, // Abhay
    dependencies: [task1.id],
    createdAt: new Date('2026-01-15T13:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-15T17:00:00Z').toISOString(),
  };

  const task3: Task = {
    id: 'task-3',
    title: 'Build Collaborative Kanban & Dashboard UI',
    description: 'Construct the responsive dashboard with priority sorting and filter controls.',
    priority: 'High',
    status: 'In Progress',
    assignedTo: user3.id, // Ajay
    dependencies: [task2.id],
    createdAt: new Date('2026-01-16T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-16T14:00:00Z').toISOString(),
  };

  const task4: Task = {
    id: 'task-4',
    title: 'Dependency Graph Analyzer & Blocked Alerting',
    description: 'Inspect prerequisite chains, highlight blockers, and enforce zero orphan completion gating.',
    priority: 'High',
    status: 'To Do',
    assignedTo: user4.id, // Narayan
    dependencies: [task3.id],
    createdAt: new Date('2026-01-16T15:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-16T15:00:00Z').toISOString(),
  };

  const task5: Task = {
    id: 'task-5',
    title: 'End-to-End Stress Testing & Release Notes',
    description: 'Simulate high-velocity task handoffs and verify zero orphan dependency loops.',
    priority: 'Low',
    status: 'To Do',
    assignedTo: user5.id, // shorya
    dependencies: [task4.id],
    createdAt: new Date('2026-01-17T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-17T09:00:00Z').toISOString(),
  };

  tasksMap.set(task1.id, task1);
  tasksMap.set(task2.id, task2);
  tasksMap.set(task3.id, task3);
  tasksMap.set(task4.id, task4);
  tasksMap.set(task5.id, task5);
}

// Seed on module load
seedDefaultData();

// --- User Operations ---

export function getAllUsers(): User[] {
  return Array.from(usersMap.values());
}

export function getUserById(id: string): User | undefined {
  return usersMap.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  for (const user of usersMap.values()) {
    if (user.email.toLowerCase() === normalized) {
      return user;
    }
  }
  return undefined;
}

export function createUser(name: string, email: string): User {
  const existing = getUserByEmail(email);
  if (existing) {
    throw new Error('A user with this email address already exists.');
  }

  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newUser: User = {
    id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    avatarColor: '#10B981',
    createdAt: new Date().toISOString(),
  };

  usersMap.set(newUser.id, newUser);
  return newUser;
}

// --- Task Helper & Enrichment Operations ---

export function enrichTask(task: Task): EnrichedTask {
  const allDeps: DependencyInfo[] = [];
  const uncompletedDeps: DependencyInfo[] = [];

  for (const depId of task.dependencies) {
    const depTask = tasksMap.get(depId);
    if (depTask) {
      const isCompleted = depTask.status === 'Done';
      const info: DependencyInfo = {
        id: depTask.id,
        title: depTask.title,
        status: depTask.status,
        priority: depTask.priority,
        isCompleted,
      };
      allDeps.push(info);
      if (!isCompleted) {
        uncompletedDeps.push(info);
      }
    }
  }

  let dependentsCount = 0;
  for (const t of tasksMap.values()) {
    if (t.dependencies.includes(task.id)) {
      dependentsCount++;
    }
  }

  // Format date display (e.g. Jan 15, Jan 16, Jan 17)
  const d = new Date(task.createdAt);
  const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    ...task,
    date: formattedDate,
    isBlocked: uncompletedDeps.length > 0,
    uncompletedDependencies: uncompletedDeps,
    allDependenciesInfo: allDeps,
    assignedUser: usersMap.get(task.assignedTo),
    dependentsCount,
  };
}

export function wouldCreateCycle(taskId: string, newDependencies: string[]): boolean {
  if (newDependencies.includes(taskId)) {
    return true;
  }

  const visited = new Set<string>();

  function dfs(currentId: string): boolean {
    if (currentId === taskId) return true;
    if (visited.has(currentId)) return false;
    visited.add(currentId);

    const task = tasksMap.get(currentId);
    if (!task) return false;

    for (const depId of task.dependencies) {
      if (dfs(depId)) return true;
    }
    return false;
  }

  for (const depId of newDependencies) {
    if (dfs(depId)) return true;
  }

  return false;
}

// --- Task CRUD Operations ---

export function getAllTasks(filters?: {
  priority?: Priority;
  status?: Status;
  userId?: string;
  search?: string;
}): EnrichedTask[] {
  let list = Array.from(tasksMap.values());

  if (filters) {
    if (filters.priority && (filters.priority as string) !== 'All') {
      list = list.filter((t) => t.priority === filters.priority);
    }
    if (filters.status && (filters.status as string) !== 'All') {
      list = list.filter((t) => t.status === filters.status);
    }
    if (filters.userId && filters.userId !== 'All') {
      list = list.filter((t) => t.assignedTo === filters.userId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
  }

  return list.map(enrichTask);
}

export function getTaskById(id: string): EnrichedTask | undefined {
  const task = tasksMap.get(id);
  return task ? enrichTask(task) : undefined;
}

export function getTasksForUser(userId: string): EnrichedTask[] {
  return Array.from(tasksMap.values())
    .filter((t) => t.assignedTo === userId)
    .map(enrichTask);
}

export function getBlockedTasks(): EnrichedTask[] {
  return Array.from(tasksMap.values())
    .map(enrichTask)
    .filter((t) => t.isBlocked);
}

export function createTask(data: {
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  assignedTo?: string;
  dependencies?: string[];
}): EnrichedTask {
  const title = (data.title || '').trim();
  if (!title) {
    throw new Error('Task title is required.');
  }

  const priority: Priority = data.priority || 'Medium';
  const status: Status = data.status || 'To Do';
  const description = (data.description || '').trim();
  const assignedTo = data.assignedTo || Array.from(usersMap.keys())[0] || 'unassigned';
  const dependencies = Array.isArray(data.dependencies)
    ? Array.from(new Set(data.dependencies.filter((id) => tasksMap.has(id))))
    : [];

  const id = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  if (status === 'Done') {
    const incompleteDeps = dependencies.filter((depId) => tasksMap.get(depId)?.status !== 'Done');
    if (incompleteDeps.length > 0) {
      const names = incompleteDeps.map((id) => tasksMap.get(id)?.title || id).join(', ');
      throw new Error(`Task cannot be marked as Done because dependencies are incomplete: ${names}`);
    }
  }

  const task: Task = {
    id,
    title,
    description,
    priority,
    status,
    assignedTo,
    dependencies,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasksMap.set(task.id, task);
  return enrichTask(task);
}

export function updateTask(
  id: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>
): EnrichedTask {
  const existing = tasksMap.get(id);
  if (!existing) {
    throw new Error(`Task not found with ID ${id}`);
  }

  const title = updates.title !== undefined ? updates.title.trim() : existing.title;
  if (!title) {
    throw new Error('Task title cannot be empty.');
  }

  const description = updates.description !== undefined ? updates.description.trim() : existing.description;
  const priority = updates.priority || existing.priority;
  const targetStatus = updates.status || existing.status;
  const assignedTo = updates.assignedTo !== undefined ? updates.assignedTo : existing.assignedTo;

  let dependencies = existing.dependencies;
  if (updates.dependencies !== undefined) {
    dependencies = Array.from(
      new Set(updates.dependencies.filter((depId) => depId !== id && tasksMap.has(depId)))
    );

    if (wouldCreateCycle(id, dependencies)) {
      throw new Error('Circular dependency detected! A task cannot depend on itself or its dependents.');
    }
  }

  if (targetStatus === 'Done') {
    const incompleteDeps: string[] = [];
    for (const depId of dependencies) {
      const depTask = tasksMap.get(depId);
      if (!depTask || depTask.status !== 'Done') {
        incompleteDeps.push(depTask ? depTask.title : depId);
      }
    }

    if (incompleteDeps.length > 0) {
      throw new Error(
        `Task cannot be completed because dependencies are incomplete: ${incompleteDeps.join(', ')}`
      );
    }
  }

  const updatedTask: Task = {
    ...existing,
    title,
    description,
    priority,
    status: targetStatus,
    assignedTo,
    dependencies,
    updatedAt: new Date().toISOString(),
  };

  tasksMap.set(id, updatedTask);
  return enrichTask(updatedTask);
}

export function markTaskAsComplete(id: string): EnrichedTask {
  const task = tasksMap.get(id);
  if (!task) {
    throw new Error(`Task not found with ID ${id}`);
  }

  const incompleteDeps: { id: string; title: string; status: Status }[] = [];
  for (const depId of task.dependencies) {
    const dep = tasksMap.get(depId);
    if (!dep || dep.status !== 'Done') {
      incompleteDeps.push({
        id: depId,
        title: dep?.title || 'Unknown Task',
        status: dep?.status || 'To Do',
      });
    }
  }

  if (incompleteDeps.length > 0) {
    const err = new Error('Task cannot be completed because dependencies are incomplete.');
    (err as any).incompleteDependencies = incompleteDeps;
    throw err;
  }

  task.status = 'Done';
  task.updatedAt = new Date().toISOString();
  tasksMap.set(id, task);

  return enrichTask(task);
}

export function deleteTask(id: string): boolean {
  if (!tasksMap.has(id)) {
    return false;
  }

  tasksMap.delete(id);

  for (const [taskId, task] of tasksMap.entries()) {
    if (task.dependencies.includes(id)) {
      task.dependencies = task.dependencies.filter((depId) => depId !== id);
      task.updatedAt = new Date().toISOString();
      tasksMap.set(taskId, task);
    }
  }

  return true;
}

export function getStats(): {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  blocked: number;
  highPriority: number;
} {
  const allTasks = Array.from(tasksMap.values()).map(enrichTask);

  return {
    total: allTasks.length,
    todo: allTasks.filter((t) => t.status === 'To Do').length,
    inProgress: allTasks.filter((t) => t.status === 'In Progress').length,
    done: allTasks.filter((t) => t.status === 'Done').length,
    blocked: allTasks.filter((t) => t.isBlocked).length,
    highPriority: allTasks.filter((t) => t.priority === 'High').length,
  };
}
