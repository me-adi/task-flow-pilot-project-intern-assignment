
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";

const Index = () => {
  const { tasks, addTask, toggleTaskStatus, deleteTask, filter, setFilter } = useTasks();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
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
              />
            </div>
          </div>
          <CreateTaskDialog onCreateTask={addTask} />
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

        {/* Tasks Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={toggleTaskStatus}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
