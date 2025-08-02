
import type { Task, User, KanbanColumnId } from '@/types';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUsers } from '@/lib/mock-data';
import { MoreVertical, GripVertical, Target, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '../ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove?: (taskId: string, newStatus: KanbanColumnId) => void;
}

const priorityMap = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
} as const;

export function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const assignees =
    task.assigneeIds?.map((id) => mockUsers.find((u) => u.id === id)).filter(Boolean) as User[] | undefined;

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };
  
  const handleMove = (newStatus: KanbanColumnId) => {
    if (onMove) {
      onMove(task.id, newStatus);
    }
  };

  const availableStatuses: KanbanColumnId[] = ['todo', 'inprogress', 'done'];

  return (
    <Card className="mb-4 group bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all shadow-sm hover:shadow-md animate-fade-in-up">
      <CardHeader className="p-4 flex flex-row items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-base font-medium flex items-center">
            <GripVertical className="h-5 w-5 mr-1 text-muted-foreground cursor-grab" />
            {task.title}
          </CardTitle>
          {task.description && (
            <CardDescription className="text-xs">
              {task.description}
            </CardDescription>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
             {onMove && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Move to</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {availableStatuses
                      .filter((status) => status !== task.status)
                      .map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleMove(status)}
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          {status === 'todo' && 'To Do'}
                          {status === 'inprogress' && 'In Progress'}
                          {status === 'done' && 'Done'}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex justify-between items-end">
        <div className="flex items-center gap-2 flex-wrap">
          {task.priority && (
            <Badge variant={priorityMap[task.priority]}>
              {task.priority}
            </Badge>
          )}
          {task.goalId && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" /> Goal
            </Badge>
          )}
          {task.dueDate && (
             <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </Badge>
          )}
        </div>
        <div className="flex -space-x-2">
          {assignees?.map((user) => (
            <Avatar key={user.id} className="h-6 w-6 border-2 border-card">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
