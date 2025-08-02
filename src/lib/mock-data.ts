import type { Task, Goal, User } from '@/types';

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alex Doe', avatarUrl: 'https://placehold.co/100x100.png', initials: 'AD' },
  { id: 'user-2', name: 'Samira Khan', avatarUrl: 'https://placehold.co/100x100.png', initials: 'SK' },
  { id: 'user-3', name: 'John Smith', avatarUrl: 'https://placehold.co/100x100.png', initials: 'JS' },
];

export const mockGoals: Goal[] = [
  { id: 'goal-1', title: 'Launch Side Project', description: 'Complete and launch the new productivity app by end of Q3.' },
  { id: 'goal-2', title: 'Health & Fitness', description: 'Run a half-marathon and improve overall physical health.' },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design landing page mockups',
    status: 'inprogress',
    priority: 'high',
    goalId: 'goal-1',
    assigneeIds: ['user-1'],
  },
  {
    id: 'task-2',
    title: 'Develop user authentication',
    description: 'Set up Firebase Auth for email and social logins.',
    status: 'inprogress',
    priority: 'high',
    goalId: 'goal-1',
    assigneeIds: ['user-2', 'user-1'],
  },
  {
    id: 'task-3',
    title: 'Research state management libraries',
    status: 'todo',
    priority: 'medium',
    goalId: 'goal-1',
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
  },
  {
    id: 'task-6',
    title: 'Finalize Q3 budget report',
    description: 'Review with finance team and submit for approval.',
    status: 'done',
    assigneeIds: ['user-3'],
  },
  {
    id: 'task-7',
    title: 'Plan team offsite event',
    status: 'todo',
    priority: 'medium',
    assigneeIds: ['user-2'],
  },
    {
    id: 'task-8',
    title: 'Create weekly meal plan',
    status: 'todo',
    priority: 'low',
    goalId: 'goal-2',
  },
];
