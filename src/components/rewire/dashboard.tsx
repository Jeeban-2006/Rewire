'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Task, KanbanColumn, KanbanColumnId } from '@/types';
import { mockTasks } from '@/lib/mock-data';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { KanbanBoard } from './kanban-board';
import { TaskList } from './task-list';
import { AddTaskDialog } from './add-task-dialog';
import { suggestTasks } from '@/ai/flows/suggest-tasks';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [bgClass, setBgClass] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setBgClass('from-sky-200/50 to-amber-100/50');
    else if (hour >= 12 && hour < 18) setBgClass('from-sky-300/50 to-blue-300/50');
    else if (hour >= 18 && hour < 22) setBgClass('from-indigo-300/50 to-purple-400/50');
    else setBgClass('from-slate-800/50 to-indigo-900/50');
  }, []);

  const handleSuggestTasks = async (mood: string) => {
    try {
      const result = await suggestTasks({
        mood: mood,
        calendarEvents: 'Team meeting at 2pm',
        pastTasks: 'Wrote report: 60 mins, Designed mockup: 120 mins',
      });
      setSuggestedTasks(result.suggestedTasks);
      toast({
        title: 'New Suggestions!',
        description: 'AI has generated some new tasks based on your mood.',
      });
    } catch (error) {
      console.error('Error suggesting tasks:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI suggestions.',
      });
    }
  };

  const columns = useMemo<KanbanColumn[]>(() => {
    const statuses: KanbanColumnId[] = ['todo', 'inprogress', 'done'];
    const columnMap: Record<KanbanColumnId, KanbanColumn> = {
      todo: { id: 'todo', title: 'To Do', tasks: [] },
      inprogress: { id: 'inprogress', title: 'In Progress', tasks: [] },
      done: { id: 'done', title: 'Done', tasks: [] },
    };

    tasks.forEach((task) => {
      columnMap[task.status as KanbanColumnId].tasks.push(task);
    });
    
    return statuses.map(id => columnMap[id]);
  }, [tasks]);

  return (
    <div className={`flex h-screen bg-gradient-to-br transition-colors duration-1000 ${bgClass}`}>
      <Sidebar view={view} setView={setView} onAddTask={() => setDialogOpen(true)} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header onSuggestTasks={handleSuggestTasks} />
        
        {suggestedTasks.length > 0 && (
          <div className="p-4 lg:p-6 pb-0">
             <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>AI Suggestions</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {suggestedTasks.map((task, i) => <li key={i}>{task}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {view === 'kanban' ? <KanbanBoard columns={columns} /> : <TaskList />}
        </div>
      </main>
      <AddTaskDialog open={isDialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
