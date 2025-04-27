
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { CheckCircle, Trash2, Circle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onToggleStatus, onDelete }: TaskCardProps) => {
  const priorityColors = {
    Low: "text-blue-400",
    Medium: "text-yellow-400",
    High: "text-red-400",
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-base">{task.title}</h3>
          <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onToggleStatus(task.id)}
          className="hover:bg-primary/10"
        >
          {task.status === 'Completed' ? 
            <CheckCircle className="h-5 w-5 text-primary" /> : 
            <Circle className="h-5 w-5 text-muted-foreground" />
          }
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(task.id)}
          className="hover:bg-destructive/10"
        >
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
};
