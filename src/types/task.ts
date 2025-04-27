
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Active' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  userId: string;
}
