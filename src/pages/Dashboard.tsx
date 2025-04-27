import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { Search, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { tasks, addTask, toggleTaskStatus, deleteTask, filter, setFilter, isLoading } = useTasks();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search tasks..."
                className="w-64 pl-9 pr-4 py-2 rounded-full bg-secondary/50 border-transparent focus:border-primary/50 focus:ring-0 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
            <CreateTaskDialog onCreateTask={addTask} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(['All', 'Active', 'Completed'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "secondary"}
              onClick={() => setFilter(status)}
              className={filter === status ? "bg-primary text-primary-foreground" : ""}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-muted-foreground">No tasks found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery ? 'Try a different search query' : 'Create a new task to get started'}
                </p>
              </div>
            )}

            {/* Tasks Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={toggleTaskStatus}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 