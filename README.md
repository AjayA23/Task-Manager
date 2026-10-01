# Smart Task Manager

A full-stack collaborative task management application built with **Next.js / React** for the frontend and **Node.js + Express.js** for the backend, using **in-memory data storage**.

---
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20Application-success?style=for-the-badge)](https://task-manager-1-jfrs.onrender.com)
## 📁 Project Structure

```text
smart-task-manager/
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── UserList.jsx
│   │   │   └── FilterBar.jsx
│   │   │
│   │   ├── login/
│   │   │   └── page.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.jsx
│   │   │
│   │   ├── layout.jsx
│   │   └── page.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── backend/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── taskController.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── data/
│   │   └── store.js
│   │
│   ├── server.js
│   └── package.json
│
├── README.md
└── requirements.txt
```

---

## 🚀 Features

1. **User Management & Mock Authentication**:
   - Create new users (`POST /api/users`)
   - Mock user login via email (`POST /api/users/login`)
   - View all registered users and their task workloads (`GET /api/users`)
   - Switch active user session anytime.

2. **Task Management**:
   - Create, edit, and delete tasks.
   - Priority levels: `Low`, `Medium`, `High`.
   - Statuses: `To Do`, `In Progress`, `Done`.
   - Assign tasks to any registered user.
   - Multi-select prerequisite task dependencies.

3. **Strict Task Dependency Resolution**:
   - A task **cannot be marked as Done until all of its dependencies have status `Done`**.
   - If a user tries to complete a blocked task, `PATCH /api/tasks/:id/complete` responds with `HTTP 400` and lists the incomplete dependencies.
   - Circular dependency detection prevents deadlocks ($A \to B \to A$).

4. **Filters & Views**:
   - Priority filter (`All`, `High`, `Medium`, `Low`).
   - Status filter (`All`, `To Do`, `In Progress`, `Done`).
   - `My Tasks` view (filtered to the active user).
   - `Blocked Tasks` view (all tasks currently blocked by dependencies).
   - Interactive `Dependency Flow` pipeline view.

---

## 🔧 Running the Project

### Backend Setup
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```
