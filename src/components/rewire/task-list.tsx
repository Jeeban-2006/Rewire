
import type { Task } from '@/types';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, onEditTask, onDeleteTask }: TaskListProps) {

  const statusOrder = ['In Progress', 'To Do', 'Done'];

  return (
    <div className="p-4 lg:p-6 space-y-8">
      {statusOrder.map((status) => {
        const statusTasks = tasks.filter(task => {
            if (status === 'In Progress') return task.status === 'inprogress';
            if (status === 'To Do') return task.status === 'todo';
            if (status === 'Done') return task.status === 'done';
            return false;
        });
        
        return (
          statusTasks.length > 0 && (
            <div key={status}>
              <h2 className="text-lg font-semibold font-headline tracking-tight mb-4">
                {status}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statusTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )
        )
      })}
    </div>
  );
}
