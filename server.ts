import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  getAllTasks,
  getTaskById,
  getTasksForUser,
  getBlockedTasks,
  createTask,
  updateTask,
  markTaskAsComplete,
  deleteTask,
  getStats,
  seedDefaultData,
} from './src/server/store.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON middleware
  app.use(express.json());

  // Request logger for API calls
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // ==========================================
  // USER ROUTES
  // ==========================================

  // GET /api/users - View all registered users
  app.get('/api/users', (req: Request, res: Response) => {
    try {
      const users = getAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch users' });
    }
  });

  // POST /api/users - Create a new user
  app.post('/api/users', (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required fields.' });
      }

      const user = createUser(name, email);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create user' });
    }
  });

  // POST /api/users/login - Mock user login by email
  app.post('/api/users/login', (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required for login.' });
      }

      const user = getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: `User with email "${email}" not found.` });
      }

      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Login error' });
    }
  });

  // ==========================================
  // TASK ROUTES
  // ==========================================

  // GET /api/stats - Dashboard metric counts
  app.get('/api/stats', (req: Request, res: Response) => {
    try {
      const stats = getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to get stats' });
    }
  });

  // GET /api/tasks/blocked - Get blocked tasks
  app.get('/api/tasks/blocked', (req: Request, res: Response) => {
    try {
      const blocked = getBlockedTasks();
      res.json(blocked);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch blocked tasks' });
    }
  });

  // GET /api/tasks/user/:userId - Get tasks assigned to a specific user
  app.get('/api/tasks/user/:userId', (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const tasks = getTasksForUser(userId);
      res.json(tasks);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch user tasks' });
    }
  });

  // GET /api/tasks - Get all tasks with optional filters
  app.get('/api/tasks', (req: Request, res: Response) => {
    try {
      const { priority, status, userId, search } = req.query;
      const tasks = getAllTasks({
        priority: priority as any,
        status: status as any,
        userId: userId as string,
        search: search as string,
      });
      res.json(tasks);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch tasks' });
    }
  });

  // POST /api/tasks - Create new task
  app.post('/api/tasks', (req: Request, res: Response) => {
    try {
      const { title, description, priority, status, assignedTo, dependencies } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Task title is required.' });
      }

      const newTask = createTask({
        title,
        description,
        priority,
        status,
        assignedTo,
        dependencies,
      });

      res.status(201).json(newTask);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create task' });
    }
  });

  // PUT /api/tasks/:taskId - Update existing task
  app.put('/api/tasks/:taskId', (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const { title, description, priority, status, assignedTo, dependencies } = req.body;

      const updated = updateTask(taskId, {
        title,
        description,
        priority,
        status,
        assignedTo,
        dependencies,
      });

      res.json(updated);
    } catch (err: any) {
      res.status(400).json({
        message: err.message || 'Failed to update task',
        error: err.message,
      });
    }
  });

  // PATCH /api/tasks/:taskId/complete - Mark task as complete (checks dependencies)
  app.patch('/api/tasks/:taskId/complete', (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const completed = markTaskAsComplete(taskId);
      res.json(completed);
    } catch (err: any) {
      // In accordance with specification:
      // If task cannot be completed because dependencies are incomplete, return 400
      res.status(400).json({
        message: 'Task cannot be completed because dependencies are incomplete.',
        error: err.message,
        incompleteDependencies: err.incompleteDependencies || [],
      });
    }
  });

  // DELETE /api/tasks/:taskId - Delete a task
  app.delete('/api/tasks/:taskId', (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const success = deleteTask(taskId);
      if (!success) {
        return res.status(404).json({ error: `Task ${taskId} not found` });
      }
      res.json({ success: true, message: `Task ${taskId} deleted successfully.` });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete task' });
    }
  });

  // POST /api/reset-demo - Reset in-memory database to default seed
  app.post('/api/reset-demo', (req: Request, res: Response) => {
    try {
      seedDefaultData();
      res.json({ success: true, message: 'Database reset to default seed data.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to reset data' });
    }
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Task Manager] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
