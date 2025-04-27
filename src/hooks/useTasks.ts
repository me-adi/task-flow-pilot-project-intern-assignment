import { useState, useEffect } from 'react';
import { Task, Priority, Status } from '@/types/task';
import { taskService } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Placeholder data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature',
    status: 'Active',
    priority: 'High',
    createdAt: new Date().toISOString(),
    userId: 'user1'
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Review and merge pending pull requests',
    status: 'Completed',
    priority: 'Medium',
    createdAt: new Date().toISOString(),
    userId: 'user1'
  }
];

export const useTasks = () => {
  const [filter, setFilter] = useState<'All' | Status>('All');
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Convert filter to API filter parameter
  const getFilterParams = () => {
    if (filter === 'All') return {};
    return { status: filter };
  };

  // Fetch tasks query
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => taskService.getAllTasks(getFilterParams()),
    enabled: isAuthenticated,
    select: (data) => data.tasks,
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch tasks',
        variant: 'destructive',
      });
    }
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create task',
        variant: 'destructive',
      });
    }
  });

  // Toggle task status mutation
  const toggleTaskStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      taskService.toggleTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update task',
        variant: 'destructive',
      });
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete task',
        variant: 'destructive',
      });
    }
  });

  // Wrapper functions for mutations
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    addTaskMutation.mutate(task);
  };

  const toggleTaskStatus = (taskId: string) => {
    const task = data?.find(task => task.id === taskId);
    if (task) {
      toggleTaskStatusMutation.mutate({ id: taskId, status: task.status });
    }
  };

  const deleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  return {
    tasks: data || [],
    isLoading,
    error,
    addTask,
    toggleTaskStatus,
    deleteTask,
    filter,
    setFilter,
  };
};
