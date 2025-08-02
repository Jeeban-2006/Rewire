
import { useState, useEffect } from 'react';
import type { KanbanColumn, KanbanColumnId, Task } from '@/types';
import { TaskCard } from './task-card';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: KanbanColumnId) => void;
  onDragEnd: (result: DropResult) => void;
}

export function KanbanBoard({ columns, onEditTask, onDeleteTask, onMoveTask, onDragEnd }: KanbanBoardProps) {
  // StrictMode-compliant drag and drop fix
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }
  // End of fix

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 p-4 lg:p-6 h-full overflow-x-auto">
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`w-full md:w-80 lg:w-96 flex-shrink-0 transition-colors duration-200 rounded-lg ${snapshot.isDraggingOver ? 'bg-secondary' : ''}`}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-lg font-semibold font-headline tracking-tight">
                    {column.title}
                  </h2>
                  <span className="text-sm font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <div className="h-full rounded-lg px-1">
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-4 ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-sm'}`}
                        >
                          <TaskCard
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            onMove={onMoveTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
