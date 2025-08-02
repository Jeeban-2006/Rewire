export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  goalId?: string;
  assigneeIds?: string[];
};

export type Goal = {
  id: string;
  title: string;
  description: string;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  initials: string;
};

export type KanbanColumnId = 'todo' | 'inprogress' | 'done';

export type KanbanColumn = {
  id: KanbanColumnId;
  title: string;
  tasks: Task[];
};
