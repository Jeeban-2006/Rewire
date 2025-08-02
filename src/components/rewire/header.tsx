
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Calendar as CalendarIcon, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  streak: number;
  user: { name: string | null; email: string | null } | null;
}

export function Header({ searchQuery, setSearchQuery, selectedDate, setSelectedDate, streak, user }: HeaderProps) {
  
  const handleTodayClick = () => {
    setSelectedDate(new Date());
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          {user?.name && (
             <h1 className="text-2xl font-bold font-headline hidden lg:block">
              {getGreeting()}, {user.name.split(' ')[0]}!
            </h1>
          )}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {streak > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 font-semibold text-amber-500">
                  <Flame className="h-5 w-5" />
                  <span>{streak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>You have a {streak}-day streak! Keep it up!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Button variant="outline" onClick={handleTodayClick}>
          Today
        </Button>
         <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {selectedDate && (
          <Button variant="ghost" onClick={() => setSelectedDate(undefined)}>Clear</Button>
        )}
      </div>
    </header>
  );
}
