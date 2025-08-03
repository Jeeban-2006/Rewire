
import type { KanbanColumn, KanbanColumnId, Task } from '@/types';
import { TaskCard } from './task-card';

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: KanbanColumnId) => void;
}

export function KanbanBoard({ columns, onEditTask, onDeleteTask, onMoveTask }: KanbanBoardProps) {
  return (
    <div className="flex gap-6 p-4 lg:p-6 h-full overflow-x-auto">
      {columns.map((column) => (
        <div
          key={column.id}
          className="w-full md:w-80 lg:w-96 flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-semibold font-headline tracking-tight">
              {column.title}
            </h2>
            <span className="text-sm font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
              {column.tasks.length}
            </span>
          </div>
          <div className="h-full rounded-lg px-1 space-y-4">
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onMove={onMoveTask}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
