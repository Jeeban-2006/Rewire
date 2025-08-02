
import type { Task } from '@/types';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const tasksByStatus: Record<string, Task[]> = {
    'In Progress': tasks.filter(task => task.status === 'inprogress'),
    'To Do': tasks.filter(task => task.status === 'todo'),
    'Done': tasks.filter(task => task.status === 'done'),
  };

  return (
    <div className="p-4 lg:p-6 space-y-8">
      {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
        statusTasks.length > 0 && (
          <div key={status}>
            <h2 className="text-lg font-semibold font-headline tracking-tight mb-4">
              {status}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statusTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
