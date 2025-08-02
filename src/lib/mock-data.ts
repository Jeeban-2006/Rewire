import type { Task, Goal, User, Badge } from '@/types';
import { Rocket, Star, Trophy } from 'lucide-react';

export const mockBadges: Badge[] = [
  { id: 'badge-1', name: 'First Steps', description: 'Completed your first task.', icon: Star },
  { id: 'badge-2', name: 'Task Master', description: 'Completed 5 tasks.', icon: Trophy },
  { id: 'badge-3', name: 'Productivity Pro', description: 'Completed 10 tasks.', icon: Rocket },
];

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alex Doe', avatarUrl: 'https://placehold.co/100x100.png', initials: 'AD', points: 150, badges: [mockBadges[0]] },
  { id: 'user-2', name: 'Samira Khan', avatarUrl: 'https://placehold.co/100x100.png', initials: 'SK', points: 275, badges: [mockBadges[0]] },
  { id: 'user-3', name: 'John Smith', avatarUrl: 'https://placehold.co/100x100.png', initials: 'JS', points: 80, badges: [] },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);


export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design landing page mockups',
    status: 'inprogress',
    priority: 'high',
    goalId: 'goal-1',
    assigneeIds: ['user-1'],
    dueDate: today.toISOString(),
  },
  {
    id: 'task-2',
    title: 'Develop user authentication',
    description: 'Set up Firebase Auth for email and social logins.',
    status: 'inprogress',
    priority: 'high',
    goalId: 'goal-1',
    assigneeIds: ['user-2', 'user-1'],
    dueDate: tomorrow.toISOString(),
  },
  {
    id: 'task-3',
    title: 'Research state management libraries',
    status: 'todo',
    priority: 'medium',
    goalId: 'goal-1',
     dueDate: nextWeek.toISOString(),
  },
  {
    id: 'task-4',
    title: 'Book dentist appointment',
    status: 'todo',
    priority: 'low',
  },
  {
    id: 'task-5',
    title: 'Go for a 5km run',
    status: 'done',
    priority: 'medium',
    goalId: 'goal-2',
    dueDate: new Date(new Date().setDate(today.getDate() - 2)).toISOString(),
    completedAt: new Date(new Date().setDate(today.getDate() - 2)).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Finalize Q3 budget report',
    description: 'Review with finance team and submit for approval.',
    status: 'done',
    assigneeIds: ['user-3'],
    completedAt: new Date(new Date().setDate(today.getDate() - 1)).toISOString(),
  },
  {
    id: 'task-7',
    title: 'Plan team offsite event',
    status: 'todo',
    priority: 'medium',
    assigneeIds: ['user-2'],
    dueDate: new Date(new Date().setDate(today.getDate() + 14)).toISOString(),
  },
    {
    id: 'task-8',
    title: 'Create weekly meal plan',
    status: 'todo',
    priority: 'low',
    goalId: 'goal-2',
    dueDate: today.toISOString(),
  },
];
