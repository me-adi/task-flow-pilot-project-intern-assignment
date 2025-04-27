import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// In-memory database
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

class InMemoryDatabase {
  private users: User[] = [];
  private tasks: Task[] = [];

  constructor() {
    // Initialize with some test data
    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    // Create test users
    const testUsers = [
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123'
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123'
      }
    ];

    // Add users to the database with hashed passwords
    for (const user of testUsers) {
      await this.createUser(user.name, user.email, user.password);
    }

    console.log('In-memory database initialized with test users');
  }

  // User methods
  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    console.log(`Creating user with email: ${email}`);

    // Check if the user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add the user to the in-memory database
    this.users.push(newUser);

    console.log(`Created user with ID: ${newUser.id}, Name: ${newUser.name}, Email: ${newUser.email}`);
    
    return newUser;
  }

  async comparePassword(userId: string, candidatePassword: string): Promise<boolean> {
    const user = await this.findUserById(userId);
    if (!user) return false;
    return bcrypt.compare(candidatePassword, user.password);
  }

  async deleteUser(email: string): Promise<void> {
    this.users = this.users.filter(u => u.email !== email);
  }

  // Task methods
  async getTasks(userId: string, filter?: any): Promise<Task[]> {
    let filteredTasks = this.tasks.filter(t => t.userId === userId);
    
    // Apply filters
    if (filter) {
      if (filter.status) {
        filteredTasks = filteredTasks.filter(t => t.status === filter.status);
      }
      if (filter.priority) {
        filteredTasks = filteredTasks.filter(t => t.priority === filter.priority);
      }
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredTasks = filteredTasks.filter(t => 
          t.title.toLowerCase().includes(searchTerm) || 
          t.description.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    // Sort by creation date (newest first)
    return filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    const task = this.tasks.find(t => t.id === taskId && t.userId === userId);
    return task || null;
  }

  async createTask(taskData: {
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    userId: string;
  }): Promise<Task> {
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description,
      status: 'Active',
      priority: taskData.priority,
      userId: taskData.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(taskId: string, userId: string, updateData: Partial<Task>): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId && t.userId === userId);
    
    if (taskIndex === -1) return null;
    
    // Update task
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    return this.tasks[taskIndex];
  }

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => !(t.id === taskId && t.userId === userId));
    return this.tasks.length < initialLength;
  }

  // Helper methods for testing/development
  getAllUsers(): User[] {
    return this.users.map(({ password, ...rest }) => ({ 
      ...rest, 
      password: '***' // Hide passwords in logs
    })) as User[];
  }

  clearDatabase(): void {
    this.users = [];
    this.tasks = [];
    console.log('Database cleared');
  }
}

// Export a singleton instance
const db = new InMemoryDatabase();
export default db; 