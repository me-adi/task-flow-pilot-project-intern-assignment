# Task Flow Pilot Project

A full-stack task management application built with the MERN stack (MongoDB with in-memory database option, Express, React, Node.js).

## Features

- **User Authentication**: Register, login, and manage user sessions
- **Task Management**: Create, read, update, and delete tasks
- **Task Organization**: Filter tasks by status and priority
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Shadcn UI components

## Tech Stack

### Backend
- Node.js & Express
- TypeScript
- In-memory database for quick testing (no MongoDB setup required)
- JWT authentication
- RESTful API

### Frontend
- React 18
- TypeScript
- Vite build tool
- React Router for navigation
- Tanstack React Query for data fetching
- Shadcn UI & Tailwind CSS for styling
- Context API for state management

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-flow-pilot-project.git
cd task-flow-pilot-project
```

2. Install dependencies for both frontend and backend
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Running the Application

1. Start the backend server
```bash
# In the backend directory
npm run dev
```

2. Start the frontend development server
```bash
# In the root directory
npm run dev
```

3. Access the application
- Frontend: http://localhost:5173 (or the port shown in your terminal)
- Backend API: http://localhost:5000

## Test Users

The application comes with pre-configured test users for immediate testing:

1. **Test User 1**
   - Email: test1@example.com
   - Password: password123

2. **Test User 2**
   - Email: test2@example.com
   - Password: password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks for the logged-in user (protected)
- `POST /api/tasks` - Create a new task (protected)
- `GET /api/tasks/:id` - Get a specific task (protected)
- `PATCH /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)

## Project Structure

```
task-flow-pilot-project/
├── backend/                 # Backend code
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middlewares
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Utility scripts
│   │   ├── services/        # Business logic
│   │   └── index.ts         # Entry point
│   ├── package.json
│   └── tsconfig.json
├── src/                     # Frontend code
│   ├── components/          # Reusable components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and API client
│   ├── pages/               # Page components
│   ├── types/               # TypeScript type definitions
│   └── App.tsx              # Main app component
├── package.json
└── README.md                # This file
```

## License

This project is licensed under the MIT License. 