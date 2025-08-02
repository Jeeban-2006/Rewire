import type { KanbanColumn } from '@/types';
import { TaskCard } from './task-card';

interface KanbanBoardProps {
  columns: KanbanColumn[];
}

export function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="flex gap-6 p-4 lg:p-6 h-full overflow-x-auto">
      {columns.map((column) => (
        <div
          key={column.id}
          className="w-full md:w-80 lg:w-96 flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-headline tracking-tight">
              {column.title}
            </h2>
            <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {column.tasks.length}
            </span>
          </div>
          <div className="h-full rounded-lg">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
