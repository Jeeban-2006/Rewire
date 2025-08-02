
'use client';

import {
  LayoutGrid,
  List,
  Target,
  Users,
  Settings,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/rewire/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockGoals, mockUsers } from '@/lib/mock-data';
import type { Goal } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  view: 'kanban' | 'list';
  setView: (view: 'kanban' | 'list') => void;
  onAddTask: () => void;
  onSettingsClick: () => void;
}

export function Sidebar({ view, setView, onAddTask, onSettingsClick }: SidebarProps) {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r p-4 shrink-0">
      <Logo className="mb-6" />

      <div className="flex flex-col gap-1 mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1">
          Views
        </h3>
        <Button
          variant={view === 'kanban' ? 'secondary' : 'ghost'}
          className="justify-start"
          onClick={() => setView('kanban')}
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Kanban Board
        </Button>
        <Button
          variant={view === 'list' ? 'secondary' : 'ghost'}
          className="justify-start"
          onClick={() => setView('list')}
        >
          <List className="mr-2 h-4 w-4" />
          Task List
        </Button>
      </div>

      <Button onClick={onAddTask} className="w-full mb-6">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Task
      </Button>

      <Separator className="mb-6" />

      <div className="flex-grow overflow-y-auto pr-1 -mr-4 space-y-6">
        <GoalSection goals={mockGoals} />
        <CollaboratorsSection />
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <Button variant="ghost" className="justify-start" onClick={onSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
         <Button variant="ghost" className="justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
        {user && (
          <div className="flex items-center gap-3 p-2 mt-4 border-t pt-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/100x100.png" alt={user.name || ''} data-ai-hint="person" />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function GoalSection({ goals }: { goals: Goal[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-2">
        Long-Term Goals
      </h3>
      <div className="space-y-3">
        {goals.map((goal) => (
          <div key={goal.id} className="p-2 rounded-md hover:bg-accent/50">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">{goal.title}</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {goal.description}
            </p>
            <Progress value={33} className="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CollaboratorsSection() {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-2">
        Collaborators
      </h3>
      <div className="flex items-center space-x-2 p-2">
        <TooltipProvider>
          {mockUsers.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-background hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person"/>
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
