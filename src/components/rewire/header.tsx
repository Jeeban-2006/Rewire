'use client';

import { Search, Wind, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeaderProps {
  onSuggestTasks: (mood: string) => void;
}

export function Header({ onSuggestTasks }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-9" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Select onValueChange={onSuggestTasks}>
          <SelectTrigger className="w-[180px]">
            <Wind className="mr-2 h-4 w-4" />
            <SelectValue placeholder="How are you feeling?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="energetic">Energetic</SelectItem>
            <SelectItem value="focused">Focused</SelectItem>
            <SelectItem value="tired">Tired</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <CalendarDays className="mr-2 h-4 w-4" />
          Today
        </Button>
      </div>
    </header>
  );
}
