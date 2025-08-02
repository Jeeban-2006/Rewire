export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  goalId?: string;
  assigneeIds?: string[];
  completedAt?: string;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  initials: string;
  points: number;
  badges: Badge[];
};

export type KanbanColumnId = 'todo' | 'inprogress' | 'done';

export type KanbanColumn = {
  id: KanbanColumnId;
  title: string;
  tasks: Task[];
};
