
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Task, KanbanColumn, KanbanColumnId } from '@/types';
import { mockTasks } from '@/lib/mock-data';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { KanbanBoard } from './kanban-board';
import { TaskList } from './task-list';
import { AddTaskDialog } from './add-task-dialog';
import { EditTaskDialog } from './edit-task-dialog';

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [bgClass, setBgClass] = useState('');
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real app, you'd fetch this data.
    // For now, we'll deep copy mockTasks to avoid mutation issues.
    setTasks(JSON.parse(JSON.stringify(mockTasks)));
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setBgClass('from-sky-200/50 to-amber-100/50');
    else if (hour >= 12 && hour < 18) setBgClass('from-sky-300/50 to-blue-300/50');
    else if (hour >= 18 && hour < 22) setBgClass('from-indigo-300/50 to-purple-400/50');
    else setBgClass('from-slate-800/50 to-indigo-900/50');
  }, []);

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      status: 'todo',
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setAddDialogOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  
  const handleMoveTask = (taskId: string, newStatus: KanbanColumnId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);


  const columns = useMemo<KanbanColumn[]>(() => {
    const statuses: KanbanColumnId[] = ['todo', 'inprogress', 'done'];
    const columnMap: Record<KanbanColumnId, KanbanColumn> = {
      todo: { id: 'todo', title: 'To Do', tasks: [] },
      inprogress: { id: 'inprogress', title: 'In Progress', tasks: [] },
      done: { id: 'done', title: 'Done', tasks: [] },
    };

    filteredTasks.forEach((task) => {
      if (columnMap[task.status as KanbanColumnId]) {
        columnMap[task.status as KanbanColumnId].tasks.push(task);
      }
    });
    
    return statuses.map(id => columnMap[id]);
  }, [filteredTasks]);

  return (
    <div className={`flex h-screen bg-gradient-to-br transition-colors duration-1000 ${bgClass}`}>
      <Sidebar view={view} setView={setView} onAddTask={() => setAddDialogOpen(true)} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="flex-1 overflow-y-auto">
          {view === 'kanban' ? (
            <KanbanBoard
              columns={columns}
              onEditTask={openEditDialog}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onEditTask={openEditDialog}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </div>
      </main>
      <AddTaskDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddTask={handleAddTask}
      />
       {editingTask && (
        <EditTaskDialog
          key={editingTask.id}
          open={isEditDialogOpen}
          onOpenChange={setEditDialogOpen}
          task={editingTask}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
}
