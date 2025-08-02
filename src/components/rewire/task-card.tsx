import type { Task, User } from '@/types';
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
import { MoreVertical, GripVertical, Target } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
}

const priorityMap = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
} as const;

export function TaskCard({ task }: TaskCardProps) {
  const assignees =
    task.assigneeIds?.map((id) => mockUsers.find((u) => u.id === id)).filter(Boolean) as User[] | undefined;

  return (
    <Card className="mb-4 group bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all shadow-sm hover:shadow-md">
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delegate</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
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
