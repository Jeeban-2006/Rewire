import type { Task } from '@/types';
import { TaskCard } from './task-card';
import { mockTasks } from '@/lib/mock-data';

export function TaskList() {
  const tasksByStatus: Record<string, Task[]> = {
    'In Progress': mockTasks.filter(task => task.status === 'inprogress'),
    'To Do': mockTasks.filter(task => task.status === 'todo'),
    'Done': mockTasks.filter(task => task.status === 'done'),
  };

  return (
    <div className="p-4 lg:p-6 space-y-8">
      {Object.entries(tasksByStatus).map(([status, tasks]) => (
        tasks.length > 0 && (
          <div key={status}>
            <h2 className="text-lg font-semibold font-headline tracking-tight mb-4">
              {status}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
