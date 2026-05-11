# Team Task Manager

A full-stack MERN application for managing projects, assigning tasks, tracking progress, and collaborating with team members.

---

# 🚀 Features

## 🔐 Authentication
- User Signup
- User Login
- JWT Authentication
- Protected Routes
- Persistent Login using Local Storage

---

## 📁 Project Management
- Create Projects
- Open Project Dashboard
- View Team Members
- Add Members to Projects
- Remove Members from Projects
- Role-based Access Control

---

## ✅ Task Management
- Create Tasks
- Assign Tasks to Members
- Set Priority Levels
- Add Due Dates
- Update Task Status
- Filter Tasks by Project

---

## 📊 Dashboard Analytics
- Total Tasks
- Todo Tasks
- In Progress Tasks
- Completed Tasks
- Overdue Tasks
- Task Distribution per User

---

## 📱 Responsive UI
- Mobile Responsive
- Tablet Responsive
- Desktop Responsive
- Modern UI using Tailwind CSS

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- JWT Decode

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt.js
- CORS

## Database
- MongoDB Atlas

## Deployment
- Railway

---

# 📂 Project Structure

## Backend Structure

```bash
backend/
│
├── middlewares/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── project.model.js
│   ├── task.model.js
│   └── user.model.js
│
├── routes/
│   ├── authRoutes.js
│   ├── projectsRoutes.js
│   └── taskRoutes.js
│
├── .env
├── package.json
├── package-lock.json
└── server.js

```
## Frontend Structure

```bash
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AddMember.jsx
│   │   ├── AddProject.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── TaskCard.jsx
│   │   └── TaskCreate.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── DashBoard.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md

```

---

# ⚙️ Installation & Setup
## 1️⃣ Clone Repository
```bash
git clone https://github.com/faizanafridi620/team-task.manager.git
cd team-task-manager
```

# 🔧 Backend Setup
## Navigate to backend
```bash
cd backend
```

## Install dependencies
```bash
npm install
```

## Create `.env`
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Run backend server
```bash
npm run dev
```

# 💻 Frontend Setup
## Navigate to frontend
```bash
cd frontend
```

## Install dependencies
```
npm install
```
## Create ```env```
```env
VITE_API_URL=http://localhost:8000/api
```

# Run frontend
```bash
npm run dev
```
