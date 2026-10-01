import { User, EnrichedTask, Priority, Status, DashboardStats } from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // --- Users ---
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  },

  async createUser(name: string, email: string): Promise<User> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create user');
    }
    return data;
  },

  async login(email: string): Promise<User> {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'User not found');
    }
    return data;
  },

  // --- Tasks ---
  async getTasks(params?: {
    priority?: Priority;
    status?: Status;
    userId?: string;
    search?: string;
  }): Promise<EnrichedTask[]> {
    const query = new URLSearchParams();
    if (params?.priority) query.append('priority', params.priority);
    if (params?.status) query.append('status', params.status);
    if (params?.userId) query.append('userId', params.userId);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    const res = await fetch(`${API_BASE}/tasks${qs ? `?${qs}` : ''}`);
    if (!res.ok) throw new Error('Failed to load tasks');
    return res.json();
  },

  async getBlockedTasks(): Promise<EnrichedTask[]> {
    const res = await fetch(`${API_BASE}/tasks/blocked`);
    if (!res.ok) throw new Error('Failed to load blocked tasks');
    return res.json();
  },

  async getUserTasks(userId: string): Promise<EnrichedTask[]> {
    const res = await fetch(`${API_BASE}/tasks/user/${userId}`);
    if (!res.ok) throw new Error('Failed to load user tasks');
    return res.json();
  },

  async createTask(taskData: {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    assignedTo: string;
    dependencies: string[];
  }): Promise<EnrichedTask> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Failed to create task');
    }
    return data;
  },

  async updateTask(
    taskId: string,
    updates: {
      title?: string;
      description?: string;
      priority?: Priority;
      status?: Status;
      assignedTo?: string;
      dependencies?: string[];
    }
  ): Promise<EnrichedTask> {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to update task');
    }
    return data;
  },

  async completeTask(taskId: string): Promise<EnrichedTask> {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || data.error || 'Failed to complete task');
      (err as any).incompleteDependencies = data.incompleteDependencies;
      throw err;
    }
    return data;
  },

  async deleteTask(taskId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete task');
    }
  },

  // --- Stats ---
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
  },

  // --- Reset Demo ---
  async resetDemo(): Promise<void> {
    const res = await fetch(`${API_BASE}/reset-demo`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo');
  },
};
