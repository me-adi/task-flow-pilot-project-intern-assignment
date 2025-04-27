import axios from 'axios';
import { Task } from '@/types/task';

// Set default base URL
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Types for API responses
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface TasksResponse {
  tasks: Task[];
  count: number;
}

export interface TaskResponse {
  task: Task;
}

// Auth services
export const authService = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<{ user: any }>('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Task services
export const taskService = {
  getAllTasks: async (filters?: { status?: string; priority?: string; search?: string }) => {
    const response = await api.get<TasksResponse>('/tasks', { params: filters });
    return response.data;
  },

  getTask: async (id: string) => {
    const response = await api.get<TaskResponse>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    const response = await api.post<TaskResponse>('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>) => {
    const response = await api.patch<TaskResponse>(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  toggleTaskStatus: async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Completed' : 'Active';
    const response = await api.patch<TaskResponse>(`/tasks/${id}`, { status: newStatus });
    return response.data;
  },
};

export default api; 