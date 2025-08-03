
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { isSameDay, subDays } from 'date-fns';
import type { Task, KanbanColumn, KanbanColumnId, User, Badge } from '@/types';
import { mockTasks, mockUsers, mockBadges } from '@/lib/mock-data';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { KanbanBoard } from './kanban-board';
import { TaskList } from './task-list';
import { AddTaskDialog } from './add-task-dialog';
import { EditTaskDialog } from './edit-task-dialog';
import { SettingsDialog } from './settings-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [bgClass, setBgClass] = useState('');
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [mainUser, setMainUser] = useState<User | null>(null);
  const { user } = useAuth();

  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you'd fetch this data. We'll use the first mock user as the main user.
    setTasks(JSON.parse(JSON.stringify(mockTasks)));
    const allUsers = JSON.parse(JSON.stringify(mockUsers));
    setUsers(allUsers);
    setMainUser(allUsers[0]);
  }, []);

  useEffect(() => {
    const updateBg = () => {
      const hour = new Date().getHours();
      const isDark = document.documentElement.classList.contains('dark');
      
      if (isDark) {
         setBgClass('from-slate-800/50 to-indigo-900/50');
      } else {
        if (hour >= 5 && hour < 12) setBgClass('from-sky-200/50 to-amber-100/50');
        else if (hour >= 12 && hour < 18) setBgClass('from-sky-300/50 to-blue-300/50');
        else if (hour >= 18 && hour < 22) setBgClass('from-indigo-300/50 to-purple-400/50');
        else setBgClass('from-slate-800/50 to-indigo-900/50');
      }
    };
    
    updateBg();
    const intervalId = setInterval(updateBg, 60000); // Update every minute

    const observer = new MutationObserver(updateBg);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);
  
  const awardPoints = useCallback((points: number) => {
    if (!mainUser) return;
    const updatedUser = { ...mainUser, points: mainUser.points + points };
    setMainUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, [mainUser]);

  const awardBadge = useCallback((badge: Badge) => {
    if (!mainUser || mainUser.badges.some(b => b.id === badge.id)) return;
    
    const updatedUser = { ...mainUser, badges: [...mainUser.badges, badge] };
    setMainUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    toast({
      title: "Badge Unlocked!",
      description: `You've earned the "${badge.name}" badge.`,
    });
  }, [mainUser, toast]);

  const checkAchievements = useCallback((completedTasks: Task[]) => {
    const completedCount = completedTasks.length;
    if (completedCount >= 1 && !mainUser?.badges.some(b => b.id === 'badge-1')) {
      awardBadge(mockBadges[0]);
    }
    if (completedCount >= 5 && !mainUser?.badges.some(b => b.id === 'badge-2')) {
      awardBadge(mockBadges[1]);
    }
     if (completedCount >= 10 && !mainUser?.badges.some(b => b.id === 'badge-3')) {
      awardBadge(mockBadges[2]);
    }
  }, [mainUser, awardBadge]);

  const handleTaskCompletion = useCallback((task: Task) => {
      const updatedTask = { ...task, status: 'done' as const, completedAt: new Date().toISOString() };
      setTasks(prevTasks =>
        prevTasks.map(t => (t.id === task.id ? updatedTask : t))
      );
      awardPoints(10); // Award 10 points for each completed task
  }, [awardPoints]);

  useEffect(() => {
    if (!mainUser) return;
    const userCompletedTasks = tasks.filter(t => t.status === 'done' && t.assigneeIds?.includes(mainUser.id));
    checkAchievements(userCompletedTasks);
  }, [tasks, mainUser, checkAchievements]);


  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      status: 'todo',
      assigneeIds: mainUser ? [mainUser.id] : [],
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setAddDialogOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    if (updatedTask.status === 'done' && !tasks.find(t=>t.id === updatedTask.id)?.completedAt) {
      handleTaskCompletion(updatedTask);
    } else {
       setTasks(prevTasks =>
        prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
      );
    }
    setEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  
  const handleMoveTask = (taskId: string, newStatus: KanbanColumnId) => {
    const taskToMove = tasks.find(t => t.id === taskId);
    if (taskToMove && newStatus === 'done' && !taskToMove.completedAt) {
      handleTaskCompletion(taskToMove);
    } else {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(task => 
        task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
      );
    }
    
    return filtered;
  }, [tasks, searchQuery, selectedDate]);

  const streak = useMemo(() => {
    if (!mainUser) return 0;
    
    const completedByUser = tasks
      .filter(t => t.status === 'done' && t.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    let currentStreak = 0;
    let today = new Date();
    
    const uniqueDays = [...new Set(completedByUser.map(t => new Date(t.completedAt!).toDateString()))];

    if (uniqueDays.length === 0) return 0;

    const todayString = today.toDateString();
    const yesterdayString = subDays(today, 1).toDateString();

    let lastCompletionDayIndex = -1;

    if (uniqueDays.includes(todayString)) {
        lastCompletionDayIndex = uniqueDays.indexOf(todayString);
        currentStreak = 1;
    } else if (uniqueDays.includes(yesterdayString)) {
        lastCompletionDayIndex = uniqueDays.indexOf(yesterdayString);
        currentStreak = 1;
    } else {
        return 0;
    }
    
    for (let i = lastCompletionDayIndex + 1; i < uniqueDays.length; i++) {
        const currentDay = new Date(uniqueDays[i]);
        const prevDay = new Date(uniqueDays[i-1]);

        if (isSameDay(subDays(prevDay, 1), currentDay)) {
            currentStreak++;
        } else {
            break;
        }
    }
    
    return currentStreak;
  }, [tasks, mainUser]);


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
      <Sidebar 
        view={view} 
        setView={setView} 
        onAddTask={() => setAddDialogOpen(true)}
        onSettingsClick={() => setSettingsDialogOpen(true)}
        user={mainUser}
        allUsers={users}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          streak={streak}
          user={user}
        />
        
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
      <SettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </div>
  );
}
